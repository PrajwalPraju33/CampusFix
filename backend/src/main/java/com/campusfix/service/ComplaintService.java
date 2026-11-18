package com.campusfix.service;

import com.campusfix.dto.*;
import com.campusfix.model.*;
import com.campusfix.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final CampusRepository campusRepository;
    private final BuildingRepository buildingRepository;
    private final UserRepository userRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final AttachmentRepository attachmentRepository;
    private final FeedbackRepository feedbackRepository;

    @Transactional
    public ComplaintResponse createComplaint(ComplaintCreateRequest request, Long currentUserId) {
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + currentUserId));

        Campus campus = campusRepository.findById(request.getCampusId())
                .orElseThrow(() -> new IllegalArgumentException("Campus not found: " + request.getCampusId()));

        Building building = buildingRepository.findById(request.getBuildingId())
                .orElseThrow(() -> new IllegalArgumentException("Building not found: " + request.getBuildingId()));

        Institution institution = campus.getInstitution();

        // Generate sequential unique complaint number: CF-1001, CF-1002...
        String complaintNumber = generateNextComplaintNumber();

        Complaint complaint = Complaint.builder()
                .complaintNumber(complaintNumber)
                .institution(institution)
                .campus(campus)
                .building(building)
                .user(user)
                .category(request.getCategory().trim())
                .problemTitle(request.getProblemTitle().trim())
                .description(request.getDescription().trim())
                .roomLabNo(request.getRoomLabNo().trim())
                .priority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM)
                .status(ComplaintStatus.SUBMITTED)
                .build();

        complaint = complaintRepository.save(complaint);

        // Record initial status history
        StatusHistory initialHistory = StatusHistory.builder()
                .complaint(complaint)
                .previousStatus(null)
                .newStatus(ComplaintStatus.SUBMITTED.name())
                .updatedBy(user.getName())
                .remarks("Complaint submitted via Student Portal.")
                .build();
        statusHistoryRepository.save(initialHistory);

        // Attach files if provided
        if (request.getAttachmentPaths() != null) {
            for (String path : request.getAttachmentPaths()) {
                if (path != null && !path.isBlank()) {
                    String filename = path.contains("/") ? path.substring(path.lastIndexOf('/') + 1) : path;
                    Attachment attachment = Attachment.builder()
                            .complaint(complaint)
                            .fileName(filename)
                            .filePath(path)
                            .build();
                    attachmentRepository.save(attachment);
                    complaint.getAttachments().add(attachment);
                }
            }
        }

        return mapToComplaintResponse(complaint);
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponse> getMyComplaints(Long currentUserId) {
        List<Complaint> complaints = complaintRepository.findByUserIdOrderByCreatedAtDesc(currentUserId);
        return complaints.stream().map(this::mapToComplaintResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ComplaintResponse getComplaintByIdForStudent(Long complaintId, Long currentUserId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found: " + complaintId));

        if (!complaint.getUser().getId().equals(currentUserId)) {
            throw new AccessDeniedException("Access denied: You can only view your own complaints");
        }

        return mapToComplaintResponse(complaint);
    }

    @Transactional
    public ComplaintResponse updatePendingComplaint(Long complaintId, ComplaintUpdateRequest request, Long currentUserId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found: " + complaintId));

        if (!complaint.getUser().getId().equals(currentUserId)) {
            throw new AccessDeniedException("Access denied: You can only edit your own complaints");
        }

        if (complaint.getStatus() != ComplaintStatus.SUBMITTED) {
            throw new IllegalStateException("Only pending complaints in SUBMITTED status can be edited by students.");
        }

        complaint.setCategory(request.getCategory().trim());
        complaint.setProblemTitle(request.getProblemTitle().trim());
        complaint.setDescription(request.getDescription().trim());
        complaint.setRoomLabNo(request.getRoomLabNo().trim());
        if (request.getPriority() != null) {
            complaint.setPriority(request.getPriority());
        }

        complaint = complaintRepository.save(complaint);

        StatusHistory editHistory = StatusHistory.builder()
                .complaint(complaint)
                .previousStatus(ComplaintStatus.SUBMITTED.name())
                .newStatus(ComplaintStatus.SUBMITTED.name())
                .updatedBy(complaint.getUser().getName())
                .remarks("Complaint details updated by student.")
                .build();
        statusHistoryRepository.save(editHistory);

        return mapToComplaintResponse(complaint);
    }

    @Transactional
    public ComplaintResponse submitFeedback(Long complaintId, FeedbackRequest request, Long currentUserId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found: " + complaintId));

        if (!complaint.getUser().getId().equals(currentUserId)) {
            throw new AccessDeniedException("Access denied: You can only submit feedback for your own complaints");
        }

        if (complaint.getStatus() != ComplaintStatus.CLOSED) {
            throw new IllegalStateException("Feedback can only be submitted after the complaint has been closed.");
        }

        if (feedbackRepository.existsByComplaintId(complaintId)) {
            throw new IllegalStateException("Feedback has already been submitted for this complaint.");
        }

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + currentUserId));

        Feedback feedback = Feedback.builder()
                .complaint(complaint)
                .user(user)
                .rating(request.getRating())
                .comments(request.getComments())
                .build();

        feedbackRepository.save(feedback);
        complaint.setFeedback(feedback);

        return mapToComplaintResponse(complaint);
    }

    private synchronized String generateNextComplaintNumber() {
        return complaintRepository.findLatestComplaint()
                .map(latest -> {
                    String numStr = latest.getComplaintNumber();
                    if (numStr != null && numStr.startsWith("CF-")) {
                        try {
                            int seq = Integer.parseInt(numStr.substring(3));
                            return "CF-" + (seq + 1);
                        } catch (NumberFormatException ignored) {}
                    }
                    return "CF-" + (1001 + latest.getId());
                })
                .orElse("CF-1001");
    }

    public ComplaintResponse mapToComplaintResponse(Complaint complaint) {
        return ComplaintResponse.builder()
                .id(complaint.getId())
                .complaintNumber(complaint.getComplaintNumber())
                .institutionId(complaint.getInstitution().getId())
                .institutionName(complaint.getInstitution().getName())
                .campusId(complaint.getCampus().getId())
                .campusName(complaint.getCampus().getName())
                .buildingId(complaint.getBuilding().getId())
                .buildingName(complaint.getBuilding().getName())
                .userId(complaint.getUser().getId())
                .userName(complaint.getUser().getName())
                .userEmail(complaint.getUser().getEmail())
                .category(complaint.getCategory())
                .problemTitle(complaint.getProblemTitle())
                .description(complaint.getDescription())
                .roomLabNo(complaint.getRoomLabNo())
                .priority(complaint.getPriority())
                .status(complaint.getStatus())
                .createdAt(complaint.getCreatedAt())
                .updatedAt(complaint.getUpdatedAt())
                .assignments(complaint.getAssignments().stream()
                        .map(a -> ComplaintResponse.AssignmentDto.builder()
                                .id(a.getId())
                                .assignedTo(a.getAssignedTo())
                                .assignedBy(a.getAssignedBy())
                                .remarks(a.getRemarks())
                                .assignedAt(a.getAssignedAt())
                                .build())
                        .collect(Collectors.toList()))
                .timeline(complaint.getStatusHistories().stream()
                        .map(h -> ComplaintResponse.StatusHistoryDto.builder()
                                .id(h.getId())
                                .previousStatus(h.getPreviousStatus())
                                .newStatus(h.getNewStatus())
                                .updatedBy(h.getUpdatedBy())
                                .remarks(h.getRemarks())
                                .createdAt(h.getCreatedAt())
                                .build())
                        .collect(Collectors.toList()))
                .attachments(complaint.getAttachments().stream()
                        .map(att -> ComplaintResponse.AttachmentDto.builder()
                                .id(att.getId())
                                .fileName(att.getFileName())
                                .filePath(att.getFilePath())
                                .uploadedAt(att.getUploadedAt())
                                .build())
                        .collect(Collectors.toList()))
                .feedback(complaint.getFeedback() != null ? ComplaintResponse.FeedbackDto.builder()
                        .id(complaint.getFeedback().getId())
                        .rating(complaint.getFeedback().getRating())
                        .comments(complaint.getFeedback().getComments())
                        .createdAt(complaint.getFeedback().getCreatedAt())
                        .build() : null)
                .build();
    }
}
