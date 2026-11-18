package com.campusfix.controller;

import com.campusfix.ai.GeminiAiService;
import com.campusfix.dto.*;
import com.campusfix.duplicate.DuplicateDetectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final GeminiAiService geminiAiService;
    private final DuplicateDetectionService duplicateDetectionService;

    @PostMapping("/analyze")
    public ResponseEntity<AiAnalysisResponse> analyzeComplaint(@RequestBody AiAnalysisRequest request) {
        AiAnalysisResponse response = geminiAiService.analyzeComplaint(request);

        // Check for duplicates in background
        if (request.getCampusId() != null && request.getBuildingId() != null) {
            DuplicateCheckRequest dupReq = DuplicateCheckRequest.builder()
                    .campusId(request.getCampusId())
                    .buildingId(request.getBuildingId())
                    .roomLabNo(request.getRoomLabNo())
                    .category(request.getCategory() != null ? request.getCategory() : response.getCategory())
                    .description(request.getDescription())
                    .build();

            DuplicateCheckResponse dupRes = duplicateDetectionService.checkDuplicates(dupReq);
            response.setDuplicateWarning(dupRes.isHasDuplicates());
            response.setPotentialDuplicates(dupRes.getDuplicates());
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/check-duplicates")
    public ResponseEntity<DuplicateCheckResponse> checkDuplicates(@RequestBody DuplicateCheckRequest request) {
        DuplicateCheckResponse response = duplicateDetectionService.checkDuplicates(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatMessageResponse> chatWithAssistant(@Valid @RequestBody ChatMessageRequest request) {
        ChatMessageResponse response = geminiAiService.chatWithAssistant(request.getMessage());
        return ResponseEntity.ok(response);
    }
}
