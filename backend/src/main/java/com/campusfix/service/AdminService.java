package com.campusfix.service;

import com.campusfix.dto.*;
import com.campusfix.model.*;
import com.campusfix.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ComplaintRepository complaintRepository;
    private final CampusRepository campusRepository;
    private final BuildingRepository buildingRepository;
    private final AssignmentRepository assignmentRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final ComplaintService complaintService;

    @Transactional(readOnly = true)
    public List<ComplaintResponse> getComplaints(Long campusId, Long buildingId, String category, ComplaintStatus status) {
        List<Complaint> complaints = complaintRepository.filterComplaints(campusId, buildingId, category, status);
        return complaints.stream().map(complaintService::mapToComplaintResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ComplaintResponse getComplaintById(Long complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found with ID: " + complaintId));
        return complaintService.mapToComplaintResponse(complaint);
    }

    @Transactional
    public ComplaintResponse verifyComplaint(Long complaintId, VerifyRequest request, String adminName) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found: " + complaintId));

        ComplaintStatus prevStatus = complaint.getStatus();
        ComplaintStatus newStatus = request.isVerified() ? ComplaintStatus.VERIFIED : ComplaintStatus.REJECTED;

        complaint.setStatus(newStatus);
        complaint = complaintRepository.save(complaint);

        String remarks = (request.getRemarks() != null && !request.getRemarks().isBlank())
                ? request.getRemarks()
                : (request.isVerified() ? "Complaint verified by administrative office." : "Complaint rejected during verification.");

        StatusHistory history = StatusHistory.builder()
                .complaint(complaint)
                .previousStatus(prevStatus.name())
                .newStatus(newStatus.name())
                .updatedBy(adminName)
                .remarks(remarks)
                .build();
        statusHistoryRepository.save(history);

        return complaintService.mapToComplaintResponse(complaint);
    }

    @Transactional
    public ComplaintResponse assignPersonnel(Long complaintId, AssignRequest request, String adminName) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found: " + complaintId));

        ComplaintStatus prevStatus = complaint.getStatus();
        complaint.setStatus(ComplaintStatus.ASSIGNED);
        complaint = complaintRepository.save(complaint);

        Assignment assignment = Assignment.builder()
                .complaint(complaint)
                .assignedTo(request.getAssignedTo().trim())
                .assignedBy(adminName)
                .remarks(request.getRemarks())
                .build();
        assignmentRepository.save(assignment);
        complaint.getAssignments().add(assignment);

        String remarks = "Assigned to: " + request.getAssignedTo().trim() +
                (request.getRemarks() != null ? " (" + request.getRemarks() + ")" : "");

        StatusHistory history = StatusHistory.builder()
                .complaint(complaint)
                .previousStatus(prevStatus.name())
                .newStatus(ComplaintStatus.ASSIGNED.name())
                .updatedBy(adminName)
                .remarks(remarks)
                .build();
        statusHistoryRepository.save(history);

        return complaintService.mapToComplaintResponse(complaint);
    }

    @Transactional
    public ComplaintResponse updateStatus(Long complaintId, StatusUpdateRequest request, String adminName) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found: " + complaintId));

        ComplaintStatus prevStatus = complaint.getStatus();
        ComplaintStatus newStatus = request.getStatus();

        complaint.setStatus(newStatus);
        complaint = complaintRepository.save(complaint);

        StatusHistory history = StatusHistory.builder()
                .complaint(complaint)
                .previousStatus(prevStatus.name())
                .newStatus(newStatus.name())
                .updatedBy(adminName)
                .remarks(request.getRemarks() != null ? request.getRemarks() : "Status updated to " + newStatus)
                .build();
        statusHistoryRepository.save(history);

        return complaintService.mapToComplaintResponse(complaint);
    }

    @Transactional
    public ComplaintResponse resolveComplaint(Long complaintId, ResolveRequest request, String adminName) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found: " + complaintId));

        ComplaintStatus prevStatus = complaint.getStatus();
        ComplaintStatus newStatus = request.isApproveAndClose() ? ComplaintStatus.CLOSED : ComplaintStatus.RESOLUTION_SUBMITTED;

        complaint.setStatus(newStatus);
        complaint = complaintRepository.save(complaint);

        String remarks = (request.getResolutionRemarks() != null && !request.getResolutionRemarks().isBlank())
                ? request.getResolutionRemarks()
                : (request.isApproveAndClose() ? "Repair verified and complaint closed." : "Technician submitted resolution for review.");

        StatusHistory history = StatusHistory.builder()
                .complaint(complaint)
                .previousStatus(prevStatus.name())
                .newStatus(newStatus.name())
                .updatedBy(adminName)
                .remarks(remarks)
                .build();
        statusHistoryRepository.save(history);

        return complaintService.mapToComplaintResponse(complaint);
    }

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboardStats(Long campusId) {
        List<Complaint> all = (campusId != null)
                ? complaintRepository.findByCampusIdOrderByCreatedAtDesc(campusId)
                : complaintRepository.findAllByOrderByCreatedAtDesc();

        long total = all.size();
        long newCount = all.stream().filter(c -> c.getStatus() == ComplaintStatus.SUBMITTED).count();
        long verified = all.stream().filter(c -> c.getStatus() == ComplaintStatus.VERIFIED).count();
        long assigned = all.stream().filter(c -> c.getStatus() == ComplaintStatus.ASSIGNED).count();
        long inProgress = all.stream().filter(c -> c.getStatus() == ComplaintStatus.IN_PROGRESS).count();
        long resolved = all.stream().filter(c -> c.getStatus() == ComplaintStatus.RESOLUTION_SUBMITTED).count();
        long closed = all.stream().filter(c -> c.getStatus() == ComplaintStatus.CLOSED).count();
        long rejected = all.stream().filter(c -> c.getStatus() == ComplaintStatus.REJECTED).count();
        long onHold = all.stream().filter(c -> c.getStatus() == ComplaintStatus.ON_HOLD).count();

        Map<String, Long> priorityDistribution = all.stream()
                .collect(Collectors.groupingBy(c -> c.getPriority().name(), Collectors.counting()));

        Map<String, Long> categoryDistribution = all.stream()
                .collect(Collectors.groupingBy(Complaint::getCategory, Collectors.counting()));

        List<ComplaintResponse> recent = all.stream()
                .limit(6)
                .map(complaintService::mapToComplaintResponse)
                .collect(Collectors.toList());

        return AdminDashboardResponse.builder()
                .totalComplaints(total)
                .newComplaints(newCount)
                .verifiedComplaints(verified)
                .assignedComplaints(assigned)
                .inProgressComplaints(inProgress)
                .resolvedComplaints(resolved)
                .closedComplaints(closed)
                .rejectedComplaints(rejected)
                .onHoldComplaints(onHold)
                .priorityDistribution(priorityDistribution)
                .categoryDistribution(categoryDistribution)
                .recentComplaints(recent)
                .build();
    }

    @Transactional
    public Building createBuilding(BuildingCreateRequest request) {
        Campus campus = campusRepository.findById(request.getCampusId())
                .orElseThrow(() -> new IllegalArgumentException("Campus not found: " + request.getCampusId()));

        Building building = Building.builder()
                .campus(campus)
                .name(request.getName().trim())
                .code(request.getCode().trim().toUpperCase())
                .build();

        return buildingRepository.save(building);
    }
}
