package com.campusfix;

import com.campusfix.dto.ComplaintCreateRequest;
import com.campusfix.dto.ComplaintResponse;
import com.campusfix.dto.ComplaintUpdateRequest;
import com.campusfix.model.*;
import com.campusfix.repository.BuildingRepository;
import com.campusfix.repository.CampusRepository;
import com.campusfix.repository.UserRepository;
import com.campusfix.service.ComplaintService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ComplaintServiceTests {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CampusRepository campusRepository;

    @Autowired
    private BuildingRepository buildingRepository;

    private User student1;
    private User student2;
    private Campus campus;
    private Building building;

    @BeforeEach
    void setUp() {
        student1 = userRepository.findByEmail("student@nie.ac.in").orElseThrow();
        student2 = userRepository.findByEmail("student2.test@nie.ac.in")
                .orElseGet(() -> userRepository.save(User.builder()
                        .name("Other Student")
                        .email("student2.test@nie.ac.in")
                        .password("pass123")
                        .role(Role.STUDENT)
                        .build()));

        campus = campusRepository.findAll().get(0);
        building = buildingRepository.findByCampusId(campus.getId()).get(0);
    }

    @Test
    @DisplayName("Student should submit complaint and receive CF- prefixed complaint number")
    void testCreateComplaintSuccess() {
        ComplaintCreateRequest request = ComplaintCreateRequest.builder()
                .campusId(campus.getId())
                .buildingId(building.getId())
                .category("Wi-Fi and Network")
                .problemTitle("Wi-Fi dropping frequently in Room 201")
                .description("Signal is very weak near the window.")
                .roomLabNo("Room 201")
                .priority(Priority.HIGH)
                .build();

        ComplaintResponse response = complaintService.createComplaint(request, student1.getId());

        assertNotNull(response.getId());
        assertTrue(response.getComplaintNumber().startsWith("CF-"));
        assertEquals("Wi-Fi and Network", response.getCategory());
        assertEquals(ComplaintStatus.SUBMITTED, response.getStatus());
        assertEquals(student1.getId(), response.getUserId());
    }

    @Test
    @DisplayName("Student should only see their own complaints")
    void testGetMyComplaintsIsolation() {
        ComplaintCreateRequest request = ComplaintCreateRequest.builder()
                .campusId(campus.getId())
                .buildingId(building.getId())
                .category("Electrical")
                .problemTitle("Switch sparking")
                .description("Sparking seen when turning on light.")
                .roomLabNo("Room 105")
                .priority(Priority.HIGH)
                .build();

        complaintService.createComplaint(request, student2.getId());

        List<ComplaintResponse> student1Complaints = complaintService.getMyComplaints(student1.getId());
        for (ComplaintResponse cr : student1Complaints) {
            assertEquals(student1.getId(), cr.getUserId());
        }
    }

    @Test
    @DisplayName("Student should be denied access when requesting another student's complaint")
    void testAccessDeniedForOtherStudentComplaint() {
        ComplaintCreateRequest request = ComplaintCreateRequest.builder()
                .campusId(campus.getId())
                .buildingId(building.getId())
                .category("Furniture")
                .problemTitle("Broken bench")
                .description("Backrest broken.")
                .roomLabNo("Room 404")
                .build();

        ComplaintResponse created = complaintService.createComplaint(request, student2.getId());

        assertThrows(AccessDeniedException.class, () ->
                complaintService.getComplaintByIdForStudent(created.getId(), student1.getId())
        );
    }

    @Test
    @DisplayName("Student can edit their own pending complaint")
    void testEditPendingComplaintSuccess() {
        ComplaintCreateRequest request = ComplaintCreateRequest.builder()
                .campusId(campus.getId())
                .buildingId(building.getId())
                .category("Electrical")
                .problemTitle("Initial Title")
                .description("Initial Description")
                .roomLabNo("Room 101")
                .build();

        ComplaintResponse created = complaintService.createComplaint(request, student1.getId());

        ComplaintUpdateRequest updateReq = ComplaintUpdateRequest.builder()
                .category("Electrical")
                .problemTitle("Updated Title by Student")
                .description("Updated Detailed Description")
                .roomLabNo("Room 101B")
                .priority(Priority.HIGH)
                .build();

        ComplaintResponse updated = complaintService.updatePendingComplaint(created.getId(), updateReq, student1.getId());

        assertEquals("Updated Title by Student", updated.getProblemTitle());
        assertEquals("Room 101B", updated.getRoomLabNo());
        assertEquals(Priority.HIGH, updated.getPriority());
    }
}
