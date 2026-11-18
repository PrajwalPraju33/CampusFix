package com.campusfix.controller;

import com.campusfix.dto.*;
import com.campusfix.model.User;
import com.campusfix.repository.UserRepository;
import com.campusfix.security.UserPrincipal;
import com.campusfix.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final ComplaintService complaintService;
    private final UserRepository userRepository;

    @PostMapping("/complaints")
    public ResponseEntity<ComplaintResponse> submitComplaint(
            @Valid @RequestBody ComplaintCreateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ComplaintResponse response = complaintService.createComplaint(request, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/complaints/my")
    public ResponseEntity<List<ComplaintResponse>> getMyComplaints(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<ComplaintResponse> response = complaintService.getMyComplaints(currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/complaints/{id}")
    public ResponseEntity<ComplaintResponse> getComplaint(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ComplaintResponse response = complaintService.getComplaintByIdForStudent(id, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/complaints/{id}")
    public ResponseEntity<ComplaintResponse> updatePendingComplaint(
            @PathVariable Long id,
            @Valid @RequestBody ComplaintUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ComplaintResponse response = complaintService.updatePendingComplaint(id, request, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/complaints/{id}/feedback")
    public ResponseEntity<ComplaintResponse> submitFeedback(
            @PathVariable Long id,
            @Valid @RequestBody FeedbackRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ComplaintResponse response = complaintService.submitFeedback(id, request, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Map<String, Object> profile = Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().name(),
                "institution", user.getInstitution() != null ? user.getInstitution().getName() : "NIE Mysore",
                "campus", user.getCampus() != null ? user.getCampus().getName() : "NIE North Campus",
                "createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : ""
        );
        return ResponseEntity.ok(profile);
    }
}
