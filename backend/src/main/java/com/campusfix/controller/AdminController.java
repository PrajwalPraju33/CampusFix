package com.campusfix.controller;

import com.campusfix.dto.*;
import com.campusfix.model.Building;
import com.campusfix.model.ComplaintStatus;
import com.campusfix.security.UserPrincipal;
import com.campusfix.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/complaints")
    public ResponseEntity<List<ComplaintResponse>> getComplaints(
            @RequestParam(required = false) Long campusId,
            @RequestParam(required = false) Long buildingId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) ComplaintStatus status) {
        List<ComplaintResponse> complaints = adminService.getComplaints(campusId, buildingId, category, status);
        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/complaints/{id}")
    public ResponseEntity<ComplaintResponse> getComplaintById(@PathVariable Long id) {
        ComplaintResponse complaint = adminService.getComplaintById(id);
        return ResponseEntity.ok(complaint);
    }

    @PostMapping("/complaints/{id}/verify")
    public ResponseEntity<ComplaintResponse> verifyComplaint(
            @PathVariable Long id,
            @RequestBody VerifyRequest request,
            @AuthenticationPrincipal UserPrincipal adminUser) {
        ComplaintResponse response = adminService.verifyComplaint(id, request, adminUser.getName());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/complaints/{id}/assign")
    public ResponseEntity<ComplaintResponse> assignPersonnel(
            @PathVariable Long id,
            @Valid @RequestBody AssignRequest request,
            @AuthenticationPrincipal UserPrincipal adminUser) {
        ComplaintResponse response = adminService.assignPersonnel(id, request, adminUser.getName());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/complaints/{id}/status")
    public ResponseEntity<ComplaintResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal adminUser) {
        ComplaintResponse response = adminService.updateStatus(id, request, adminUser.getName());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/complaints/{id}/resolve")
    public ResponseEntity<ComplaintResponse> resolveComplaint(
            @PathVariable Long id,
            @RequestBody ResolveRequest request,
            @AuthenticationPrincipal UserPrincipal adminUser) {
        ComplaintResponse response = adminService.resolveComplaint(id, request, adminUser.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard(
            @RequestParam(required = false) Long campusId,
            @AuthenticationPrincipal UserPrincipal adminUser) {
        Long targetCampusId = campusId != null ? campusId : adminUser.getCampusId();
        AdminDashboardResponse response = adminService.getDashboardStats(targetCampusId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/reports")
    public ResponseEntity<Map<String, Object>> getReports(
            @RequestParam(required = false) Long campusId,
            @AuthenticationPrincipal UserPrincipal adminUser) {
        Long targetCampusId = campusId != null ? campusId : adminUser.getCampusId();
        AdminDashboardResponse stats = adminService.getDashboardStats(targetCampusId);

        Map<String, Object> report = Map.of(
                "institution", "The National Institute of Engineering (NIE), Mysore",
                "campus", "NIE North Campus",
                "totalComplaints", stats.getTotalComplaints(),
                "resolvedRate", stats.getTotalComplaints() > 0
                        ? String.format("%.1f%%", (double) stats.getClosedComplaints() / stats.getTotalComplaints() * 100)
                        : "0.0%",
                "statusBreakdown", Map.of(
                        "SUBMITTED", stats.getNewComplaints(),
                        "VERIFIED", stats.getVerifiedComplaints(),
                        "ASSIGNED", stats.getAssignedComplaints(),
                        "IN_PROGRESS", stats.getInProgressComplaints(),
                        "RESOLUTION_SUBMITTED", stats.getResolvedComplaints(),
                        "CLOSED", stats.getClosedComplaints(),
                        "REJECTED", stats.getRejectedComplaints(),
                        "ON_HOLD", stats.getOnHoldComplaints()
                ),
                "categoryBreakdown", stats.getCategoryDistribution(),
                "priorityBreakdown", stats.getPriorityDistribution()
        );
        return ResponseEntity.ok(report);
    }

    @PostMapping("/buildings")
    public ResponseEntity<Building> createBuilding(@Valid @RequestBody BuildingCreateRequest request) {
        Building building = adminService.createBuilding(request);
        return ResponseEntity.ok(building);
    }
}
