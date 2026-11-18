package com.campusfix.ai;

import com.campusfix.dto.AiAnalysisRequest;
import com.campusfix.dto.AiAnalysisResponse;
import com.campusfix.dto.ChatMessageResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@Slf4j
public class GeminiAiService {

    @Value("${app.gemini.api-key:}")
    private String apiKey;

    @Value("${app.gemini.model:gemini-1.5-flash}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AiAnalysisResponse analyzeComplaint(AiAnalysisRequest request) {
        if (apiKey != null && !apiKey.isBlank() && !apiKey.equals("test-mock-key")) {
            try {
                return callGeminiForAnalysis(request);
            } catch (Exception ex) {
                log.warn("Gemini API call failed, switching to heuristic AI fallback: {}", ex.getMessage());
            }
        }
        return getHeuristicAnalysisFallback(request);
    }

    public ChatMessageResponse chatWithAssistant(String userMessage) {
        if (apiKey != null && !apiKey.isBlank() && !apiKey.equals("test-mock-key")) {
            try {
                return callGeminiForChat(userMessage);
            } catch (Exception ex) {
                log.warn("Gemini Chat call failed, switching to heuristic AI assistant fallback: {}", ex.getMessage());
            }
        }
        return getHeuristicChatFallback(userMessage);
    }

    private AiAnalysisResponse callGeminiForAnalysis(AiAnalysisRequest request) throws Exception {
        String url = String.format("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                model, apiKey);

        String prompt = """
            You are an expert AI maintenance coordinator for The National Institute of Engineering (NIE), Mysore - NIE North Campus.
            Analyze the following student maintenance complaint:
            - Title: %s
            - Category: %s
            - Building: %s
            - Room/Lab: %s
            - Description: %s

            Respond ONLY with a valid raw JSON object (no markdown quotes, no triple backticks) with these exact keys:
            {
              "problemTitle": "Concise standard title",
              "category": "Wi-Fi and Network|Computer Laboratory|Electrical|Classroom Facilities|Furniture|Water and Plumbing|Washroom and Sanitation|Library Facilities|Laboratory Equipment|Doors and Windows|Lift and Common Areas|Other Facilities",
              "suggestedPriority": "LOW|MEDIUM|HIGH|CRITICAL",
              "maintenanceDepartment": "Appropriate Department Name",
              "summary": "1-2 sentence executive summary of the problem",
              "recommendedAction": "Initial recommended action for maintenance staff"
            }
            """.formatted(
                request.getProblemTitle() != null ? request.getProblemTitle() : "",
                request.getCategory() != null ? request.getCategory() : "",
                request.getBuildingName() != null ? request.getBuildingName() : "",
                request.getRoomLabNo() != null ? request.getRoomLabNo() : "",
                request.getDescription() != null ? request.getDescription() : ""
        );

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode textNode = root.path("candidates").path(0).path("content").path("parts").path(0).path("text");
            if (!textNode.isMissingNode()) {
                String rawText = textNode.asText().trim();
                // Strip markdown backticks if Gemini wrapped it
                if (rawText.startsWith("```json")) {
                    rawText = rawText.substring(7);
                } else if (rawText.startsWith("```")) {
                    rawText = rawText.substring(3);
                }
                if (rawText.endsWith("```")) {
                    rawText = rawText.substring(0, rawText.length() - 3);
                }
                rawText = rawText.trim();

                JsonNode parsed = objectMapper.readTree(rawText);
                return AiAnalysisResponse.builder()
                        .problemTitle(parsed.path("problemTitle").asText(request.getProblemTitle()))
                        .category(parsed.path("category").asText(request.getCategory()))
                        .suggestedPriority(parsed.path("suggestedPriority").asText("MEDIUM"))
                        .maintenanceDepartment(parsed.path("maintenanceDepartment").asText("General Campus Maintenance"))
                        .summary(parsed.path("summary").asText("Complaint analyzed by Gemini AI."))
                        .recommendedAction(parsed.path("recommendedAction").asText("Inspect on site."))
                        .duplicateWarning(false)
                        .potentialDuplicates(Collections.emptyList())
                        .build();
            }
        }
        throw new RuntimeException("Empty or invalid response from Gemini API");
    }

    private ChatMessageResponse callGeminiForChat(String userMessage) throws Exception {
        String url = String.format("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                model, apiKey);

        String systemPrompt = """
            You are the official CampusFix AI Assistant for The National Institute of Engineering (NIE), Mysore - NIE North Campus.
            Your role is to guide students and staff on reporting issues, understanding complaint lifecycles (SUBMITTED -> VERIFIED -> ASSIGNED -> IN_PROGRESS -> RESOLUTION_SUBMITTED -> CLOSED),
            suggesting details to include for Wi-Fi, Electrical, Plumbing, and Classroom equipment issues, and explaining campus repair policies.
            Keep answers courteous, structured, concise, and helpful. Never expose private student data.
            Student Question: %s
            """.formatted(userMessage);

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", systemPrompt)))
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            JsonNode root = objectMapper.readTree(response.getBody());
            String text = root.path("candidates").path(0).path("content").path("parts").path(0).path("text").asText();
            if (!text.isBlank()) {
                return ChatMessageResponse.builder()
                        .reply(text)
                        .helpfulLinks(List.of("/student/submit-complaint", "/student/my-complaints", "/student/tracking"))
                        .suggestedPrompts(List.of(
                                "How do I report a Wi-Fi issue?",
                                "What does IN_PROGRESS status mean?",
                                "How long do electrical repairs take?"
                        ))
                        .build();
            }
        }
        throw new RuntimeException("Chat response was blank");
    }

    private AiAnalysisResponse getHeuristicAnalysisFallback(AiAnalysisRequest request) {
        String title = request.getProblemTitle() != null ? request.getProblemTitle().toLowerCase() : "";
        String desc = request.getDescription() != null ? request.getDescription().toLowerCase() : "";
        String combined = title + " " + desc;

        String priority = "MEDIUM";
        String category = request.getCategory() != null && !request.getCategory().isBlank()
                ? request.getCategory() : "Other Facilities";
        String dept = "General Campus Maintenance";
        String action = "Schedule maintenance technician visit to inspect reported room/lab.";

        if (combined.contains("shock") || combined.contains("spark") || combined.contains("fire") || combined.contains("burn") || combined.contains("short circuit")) {
            priority = "CRITICAL";
            category = "Electrical";
            dept = "Electrical Maintenance & Power Division";
            action = "Urgent safety hazard: Disconnect circuit breaker immediately and dispatch emergency electrician.";
        } else if (combined.contains("wifi") || combined.contains("wi-fi") || combined.contains("internet") || combined.contains("router") || combined.contains("lan")) {
            category = "Wi-Fi and Network";
            dept = "Campus IT & Network Operations Centre (NOC)";
            priority = combined.contains("lab") || combined.contains("exam") ? "HIGH" : "MEDIUM";
            action = "Inspect wireless access point gateway and DHCP pool allocation.";
        } else if (combined.contains("projector") || combined.contains("display") || combined.contains("hdmi") || combined.contains("speaker") || combined.contains("mic")) {
            category = "Classroom Facilities";
            dept = "Audio-Visual (AV) Maintenance Wing";
            priority = "HIGH";
            action = "Check HDMI cabling, projector lamp life, and audio amplifier output.";
        } else if (combined.contains("water") || combined.contains("leak") || combined.contains("tap") || combined.contains("pipe") || combined.contains("drain")) {
            category = "Water and Plumbing";
            dept = "Estate Office - Plumbing Division";
            priority = combined.contains("overflow") || combined.contains("flood") ? "HIGH" : "MEDIUM";
            action = "Inspect plumbing pipeline, turn off isolation valve if leaking, and replace seal/cartridge.";
        } else if (combined.contains("computer") || combined.contains("monitor") || combined.contains("mouse") || combined.contains("keyboard") || combined.contains("cpu")) {
            category = "Computer Laboratory";
            dept = "Computer Systems Support Group";
            priority = "MEDIUM";
            action = "Diagnose hardware/peripherals and test system boot sequence.";
        } else if (combined.contains("bench") || combined.contains("desk") || combined.contains("chair") || combined.contains("table")) {
            category = "Furniture";
            dept = "Carpentry & Infrastructure Maintenance";
            priority = "LOW";
            action = "Inspect damaged furniture item and repair joints or replace unit.";
        }

        String summary = String.format("Automated smart analysis: Identified %s issue at %s. Recommended priority: %s.",
                category, (request.getRoomLabNo() != null ? request.getRoomLabNo() : "designated location"), priority);

        return AiAnalysisResponse.builder()
                .problemTitle(request.getProblemTitle() != null && !request.getProblemTitle().isBlank()
                        ? request.getProblemTitle() : "Campus Maintenance Issue")
                .category(category)
                .suggestedPriority(priority)
                .maintenanceDepartment(dept)
                .summary(summary)
                .recommendedAction(action)
                .duplicateWarning(false)
                .potentialDuplicates(Collections.emptyList())
                .build();
    }

    private ChatMessageResponse getHeuristicChatFallback(String userMessage) {
        String msg = userMessage.toLowerCase();
        String reply;

        if (msg.contains("how do i report") || msg.contains("submit") || msg.contains("new complaint")) {
            reply = """
                ### How to Report an Issue on CampusFix:
                1. Navigate to **Submit Complaint** in the sidebar.
                2. Select **NIE North Campus** and your building (e.g., Sankaracharya Bhavan).
                3. Enter the exact **Room or Lab Number** (e.g., Lab 204 or Classroom 301).
                4. Select the **Category** and describe the problem in detail.
                5. Click **AI Analysis** to get automated priority and department suggestions.
                6. Check for duplicate warnings to avoid redundant complaints.
                7. Submit to receive your tracking ID (e.g., `CF-1004`).
                """;
        } else if (msg.contains("track") || msg.contains("status")) {
            reply = """
                ### Tracking Your Complaint:
                You can track any complaint in real-time under **My Complaints** or **Complaint Tracking**.
                
                The lifecycle stages are:
                * **SUBMITTED**: Complaint recorded in CampusFix.
                * **VERIFIED**: Campus administrator validated the request.
                * **ASSIGNED**: Maintenance personnel allocated.
                * **IN_PROGRESS**: Technician is performing the repair.
                * **RESOLUTION_SUBMITTED**: Repair complete, awaiting administrative approval.
                * **CLOSED**: Verified complete and resolved.
                """;
        } else if (msg.contains("in_progress") || msg.contains("in progress")) {
            reply = """
                **IN_PROGRESS** means a designated maintenance technician has been assigned and is actively working on the issue on site. 
                You can view assigned technician details and remarks in your **Complaint Tracking** timeline.
                """;
        } else if (msg.contains("wifi") || msg.contains("wi-fi") || msg.contains("internet")) {
            reply = """
                ### Reporting Wi-Fi & Network Issues:
                When reporting internet issues at NIE North Campus:
                1. Mention the **SSID** you are connecting to (e.g., `NIE-Academic-5G` or `NIE-Hostel`).
                2. Note whether the router indicator LED is red, orange, or blinking.
                3. Mention if other students in the same room are affected.
                4. Specify if the issue is *slow speed*, *cannot obtain IP address (DHCP)*, or *complete signal drop*.
                """;
        } else {
            reply = """
                Welcome to **CampusFix Assistant** for NIE North Campus!
                
                I can help you with:
                * Reporting maintenance problems (Wi-Fi, Electrical, Plumbing, AV, etc.)
                * Understanding your complaint tracking timeline and statuses
                * Tips on providing clear location details to expedite repairs
                * Campus maintenance policies and response times
                
                Feel free to ask any specific question!
                """;
        }

        return ChatMessageResponse.builder()
                .reply(reply.trim())
                .helpfulLinks(List.of("/student/submit-complaint", "/student/my-complaints", "/student/tracking"))
                .suggestedPrompts(List.of(
                        "How do I report a Wi-Fi issue?",
                        "What does IN_PROGRESS mean?",
                        "How do I track my complaint?"
                ))
                .build();
    }
}
