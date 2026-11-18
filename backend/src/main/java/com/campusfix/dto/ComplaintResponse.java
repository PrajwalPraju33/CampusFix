package com.campusfix.dto;

import com.campusfix.model.ComplaintStatus;
import com.campusfix.model.Priority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintResponse {
    private Long id;
    private String complaintNumber;
    private Long institutionId;
    private String institutionName;
    private Long campusId;
    private String campusName;
    private Long buildingId;
    private String buildingName;
    private Long userId;
    private String userName;
    private String userEmail;
    private String category;
    private String problemTitle;
    private String description;
    private String roomLabNo;
    private Priority priority;
    private ComplaintStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Timeline and nested details
    private List<AssignmentDto> assignments;
    private List<StatusHistoryDto> timeline;
    private List<AttachmentDto> attachments;
    private FeedbackDto feedback;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssignmentDto {
        private Long id;
        private String assignedTo;
        private String assignedBy;
        private String remarks;
        private LocalDateTime assignedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusHistoryDto {
        private Long id;
        private String previousStatus;
        private String newStatus;
        private String updatedBy;
        private String remarks;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AttachmentDto {
        private Long id;
        private String fileName;
        private String filePath;
        private LocalDateTime uploadedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FeedbackDto {
        private Long id;
        private Integer rating;
        private String comments;
        private LocalDateTime createdAt;
    }
}
