package com.campusfix.duplicate;

import com.campusfix.dto.DuplicateCheckRequest;
import com.campusfix.dto.DuplicateCheckResponse;
import com.campusfix.dto.DuplicateMatchDto;
import com.campusfix.model.Complaint;
import com.campusfix.model.ComplaintStatus;
import com.campusfix.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DuplicateDetectionService {

    private final ComplaintRepository complaintRepository;

    private static final Set<ComplaintStatus> CLOSED_STATUSES = Set.of(
            ComplaintStatus.CLOSED,
            ComplaintStatus.REJECTED
    );

    private static final Pattern WORD_PATTERN = Pattern.compile("[^a-zA-Z0-9]+");

    public DuplicateCheckResponse checkDuplicates(DuplicateCheckRequest request) {
        if (request.getCampusId() == null || request.getBuildingId() == null) {
            return DuplicateCheckResponse.builder()
                    .hasDuplicates(false)
                    .duplicates(Collections.emptyList())
                    .build();
        }

        // Fetch active complaints in the same campus & building
        List<Complaint> activeComplaints;
        if (request.getRoomLabNo() != null && !request.getRoomLabNo().isBlank()) {
            activeComplaints = complaintRepository.findByCampusIdAndBuildingIdAndRoomLabNoIgnoreCaseAndStatusNotIn(
                    request.getCampusId(),
                    request.getBuildingId(),
                    request.getRoomLabNo().trim(),
                    CLOSED_STATUSES
            );
        } else {
            activeComplaints = complaintRepository.findByCampusIdAndBuildingIdAndStatusNotIn(
                    request.getCampusId(),
                    request.getBuildingId(),
                    CLOSED_STATUSES
            );
        }

        List<DuplicateMatchDto> matches = new ArrayList<>();
        String inputDesc = (request.getDescription() != null ? request.getDescription() : "").toLowerCase();
        String inputCategory = (request.getCategory() != null ? request.getCategory() : "").toLowerCase();
        Set<String> inputTokens = tokenize(inputDesc);

        for (Complaint existing : activeComplaints) {
            double score = 0.0;
            StringBuilder reason = new StringBuilder();

            // 1. Room/Lab match boost
            boolean roomMatch = request.getRoomLabNo() != null &&
                    existing.getRoomLabNo() != null &&
                    request.getRoomLabNo().trim().equalsIgnoreCase(existing.getRoomLabNo().trim());
            if (roomMatch) {
                score += 0.40;
                reason.append("Same room/lab location (").append(existing.getRoomLabNo()).append("). ");
            }

            // 2. Category match boost
            boolean categoryMatch = !inputCategory.isBlank() &&
                    inputCategory.equalsIgnoreCase(existing.getCategory());
            if (categoryMatch) {
                score += 0.25;
                reason.append("Same maintenance category. ");
            }

            // 3. Text description Jaccard token similarity
            Set<String> existingTokens = tokenize((existing.getProblemTitle() + " " + existing.getDescription()).toLowerCase());
            double textSim = computeJaccardSimilarity(inputTokens, existingTokens);
            score += (textSim * 0.35);

            if (textSim > 0.3) {
                reason.append(String.format("Similar issue description (%.0f%% word match). ", textSim * 100));
            }

            // Threshold: if score >= 0.50 (e.g. same room + same category or strong text overlap)
            if (score >= 0.50) {
                matches.add(DuplicateMatchDto.builder()
                        .id(existing.getId())
                        .complaintNumber(existing.getComplaintNumber())
                        .problemTitle(existing.getProblemTitle())
                        .category(existing.getCategory())
                        .buildingName(existing.getBuilding().getName())
                        .roomLabNo(existing.getRoomLabNo())
                        .status(existing.getStatus().name())
                        .similarityScore(Math.min(1.0, Math.round(score * 100.0) / 100.0))
                        .matchReason(reason.toString().trim())
                        .build());
            }
        }

        // Sort by similarity descending
        matches.sort((a, b) -> Double.compare(b.getSimilarityScore(), a.getSimilarityScore()));

        return DuplicateCheckResponse.builder()
                .hasDuplicates(!matches.isEmpty())
                .duplicates(matches)
                .build();
    }

    private Set<String> tokenize(String text) {
        if (text == null || text.isBlank()) {
            return Collections.emptySet();
        }
        String[] words = WORD_PATTERN.split(text.toLowerCase());
        Set<String> stopWords = Set.of("the", "a", "an", "is", "in", "at", "to", "for", "of", "and", "or", "on", "it", "with", "this", "that");
        return Arrays.stream(words)
                .filter(w -> w.length() > 2 && !stopWords.contains(w))
                .collect(Collectors.toSet());
    }

    private double computeJaccardSimilarity(Set<String> set1, Set<String> set2) {
        if (set1.isEmpty() || set2.isEmpty()) {
            return 0.0;
        }
        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);

        Set<String> union = new HashSet<>(set1);
        union.addAll(set2);

        return (double) intersection.size() / union.size();
    }
}
