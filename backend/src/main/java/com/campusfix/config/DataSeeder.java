
package com.campusfix.config;

import com.campusfix.model.*;
import com.campusfix.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements ApplicationRunner {

    private final InstitutionRepository institutionRepository;
    private final CampusRepository campusRepository;
    private final BuildingRepository buildingRepository;
    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;
    private final AssignmentRepository assignmentRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final FeedbackRepository feedbackRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {

        log.info("Checking and seeding CampusFix NIE North Campus master data...");

        // 1. Institution
        Institution nie = institutionRepository.findByCode("NIE-MYS")
                .orElseGet(() -> institutionRepository.save(
                        Institution.builder()
                                .name("The National Institute of Engineering (NIE), Mysore")
                                .code("NIE-MYS")
                                .address("Manandavadi Road, Mysuru, Karnataka 570008")
                                .build()));

        // 2. Campus
        List<Campus> campuses =
                campusRepository.findByInstitutionId(nie.getId());

        Campus northCampus;

        if (campuses.isEmpty()) {
            northCampus = campusRepository.save(
                    Campus.builder()
                            .institution(nie)
                            .name("NIE North Campus")
                            .address("Koorgalli Industrial Area, Mysuru, Karnataka 570018")
                            .build());
        } else {
            northCampus = campuses.get(0);
        }

        // 3. Buildings
        List<Building> existingBuildings =
                buildingRepository.findByCampusId(northCampus.getId());

        Building b1, b2, b3;

        if (existingBuildings.isEmpty()) {

            b1 = buildingRepository.save(
                    Building.builder()
                            .campus(northCampus)
                            .name("Sankaracharya Bhavan")
                            .code("SB")
                            .build());

            b2 = buildingRepository.save(
                    Building.builder()
                            .campus(northCampus)
                            .name("Madhvacharya Bhavan")
                            .code("MB")
                            .build());

            b3 = buildingRepository.save(
                    Building.builder()
                            .campus(northCampus)
                            .name("Ramanujacharya Bhavan")
                            .code("RB")
                            .build());

        } else {

            b1 = existingBuildings.get(0);
            b2 = existingBuildings.size() > 1 ? existingBuildings.get(1) : b1;
            b3 = existingBuildings.size() > 2 ? existingBuildings.get(2) : b1;
        }

        // 4. Admin User
        User admin = userRepository.findByEmail("admin@nie.ac.in")
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .name("NIE Maintenance Admin")
                                .email("admin@nie.ac.in")
                                .password(passwordEncoder.encode("Admin@NIE2026"))
                                .role(Role.ADMIN)
                                .institution(nie)
                                .campus(northCampus)
                                .build()));

        // Reset the admin password only if it does not match.
        if (!passwordEncoder.matches("Admin@NIE2026", admin.getPassword())) {
            admin.setPassword(passwordEncoder.encode("Admin@NIE2026"));
            userRepository.save(admin);
            log.info("Admin password has been securely reset.");
        }

        log.info("ADMIN PASSWORD MATCH: {}",
                passwordEncoder.matches("Admin@NIE2026", admin.getPassword()));

        log.info("ADMIN ACCOUNT ROLE: {}", admin.getRole());
        log.info("ADMIN ACCOUNT EMAIL: {}", admin.getEmail());

        // 5. Student User
        User student = userRepository.findByEmail("student@nie.ac.in")
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .name("Prajwal Rao")
                                .email("student@nie.ac.in")
                                .password(passwordEncoder.encode("Student@NIE2026"))
                                .role(Role.STUDENT)
                                .institution(nie)
                                .campus(northCampus)
                                .build()));

        // 6. Sample Complaints if empty
        if (complaintRepository.count() == 0) {

            log.info("Seeding initial demo complaints for NIE North Campus...");

            // CF-1001: Wi-Fi issue
            Complaint c1 = Complaint.builder()
                    .complaintNumber("CF-1001")
                    .institution(nie)
                    .campus(northCampus)
                    .building(b1)
                    .user(student)
                    .category("Wi-Fi and Network")
                    .problemTitle("Wi-Fi Router Unreachable in Lab 204")
                    .description("Students in Lab 204 cannot connect to the NIE-Academic-5G Wi-Fi access point. DHCP is failing and status LED on router is blinking red.")
                    .roomLabNo("Lab 204")
                    .priority(Priority.HIGH)
                    .status(ComplaintStatus.IN_PROGRESS)
                    .build();

            c1 = complaintRepository.save(c1);

            statusHistoryRepository.save(StatusHistory.builder()
                    .complaint(c1)
                    .previousStatus(null)
                    .newStatus("SUBMITTED")
                    .updatedBy("Prajwal Rao")
                    .remarks("Complaint submitted via Student Portal.")
                    .build());

            statusHistoryRepository.save(StatusHistory.builder()
                    .complaint(c1)
                    .previousStatus("SUBMITTED")
                    .newStatus("VERIFIED")
                    .updatedBy("NIE Maintenance Admin")
                    .remarks("Verified with department lab assistant.")
                    .build());

            statusHistoryRepository.save(StatusHistory.builder()
                    .complaint(c1)
                    .previousStatus("VERIFIED")
                    .newStatus("ASSIGNED")
                    .updatedBy("NIE Maintenance Admin")
                    .remarks("Assigned to K. S. Narayanan (Network Team).")
                    .build());

            statusHistoryRepository.save(StatusHistory.builder()
                    .complaint(c1)
                    .previousStatus("ASSIGNED")
                    .newStatus("IN_PROGRESS")
                    .updatedBy("NIE Maintenance Admin")
                    .remarks("Technician is replacing the faulty switch port.")
                    .build());

            assignmentRepository.save(Assignment.builder()
                    .complaint(c1)
                    .assignedTo("K. S. Narayanan (Network Team)")
                    .assignedBy("NIE Maintenance Admin")
                    .remarks("Inspect access point gateway and reboot switch stack.")
                    .build());

            // CF-1002: Electrical
            Complaint c2 = Complaint.builder()
                    .complaintNumber("CF-1002")
                    .institution(nie)
                    .campus(northCampus)
                    .building(b2)
                    .user(student)
                    .category("Electrical")
                    .problemTitle("Ceiling Fan making noise and regulator broken")
                    .description("Ceiling fan #2 in 3rd floor classroom is making grinding noise and cannot be adjusted with the speed regulator.")
                    .roomLabNo("Classroom 301")
                    .priority(Priority.MEDIUM)
                    .status(ComplaintStatus.VERIFIED)
                    .build();

            c2 = complaintRepository.save(c2);

            statusHistoryRepository.save(StatusHistory.builder()
                    .complaint(c2)
                    .previousStatus(null)
                    .newStatus("SUBMITTED")
                    .updatedBy("Prajwal Rao")
                    .remarks("Complaint submitted via Student Portal.")
                    .build());

            statusHistoryRepository.save(StatusHistory.builder()
                    .complaint(c2)
                    .previousStatus("SUBMITTED")
                    .newStatus("VERIFIED")
                    .updatedBy("NIE Maintenance Admin")
                    .remarks("Scheduled for afternoon maintenance shift.")
                    .build());

            // CF-1003: Classroom Facilities
            Complaint c3 = Complaint.builder()
                    .complaintNumber("CF-1003")
                    .institution(nie)
                    .campus(northCampus)
                    .building(b3)
                    .user(student)
                    .category("Classroom Facilities")
                    .problemTitle("Projector HDMI display flickering in Seminar Hall")
                    .description("The overhead EPSON projector has flickering display and color distortion during presentations.")
                    .roomLabNo("Seminar Hall 1")
                    .priority(Priority.HIGH)
                    .status(ComplaintStatus.CLOSED)
                    .build();

            c3 = complaintRepository.save(c3);

            statusHistoryRepository.save(StatusHistory.builder()
                    .complaint(c3)
                    .previousStatus(null)
                    .newStatus("SUBMITTED")
                    .updatedBy("Prajwal Rao")
                    .remarks("Complaint submitted.")
                    .build());

            statusHistoryRepository.save(StatusHistory.builder()
                    .complaint(c3)
                    .previousStatus("SUBMITTED")
                    .newStatus("VERIFIED")
                    .updatedBy("NIE Maintenance Admin")
                    .remarks("Issue verified.")
                    .build());

            statusHistoryRepository.save(StatusHistory.builder()
                    .complaint(c3)
                    .previousStatus("VERIFIED")
                    .newStatus("ASSIGNED")
                    .updatedBy("NIE Maintenance Admin")
                    .remarks("Assigned to Ramesh Kumar (AV Tech).")
                    .build());

            statusHistoryRepository.save(StatusHistory.builder()
                    .complaint(c3)
                    .previousStatus("ASSIGNED")
                    .newStatus("IN_PROGRESS")
                    .updatedBy("NIE Maintenance Admin")
                    .remarks("Replaced HDMI cable.")
                    .build());

            statusHistoryRepository.save(StatusHistory.builder()
                    .complaint(c3)
                    .previousStatus("IN_PROGRESS")
                    .newStatus("RESOLUTION_SUBMITTED")
                    .updatedBy("NIE Maintenance Admin")
                    .remarks("Tested with presentation laptop.")
                    .build());

            statusHistoryRepository.save(StatusHistory.builder()
                    .complaint(c3)
                    .previousStatus("RESOLUTION_SUBMITTED")
                    .newStatus("CLOSED")
                    .updatedBy("NIE Maintenance Admin")
                    .remarks("Resolution approved and closed.")
                    .build());

            assignmentRepository.save(Assignment.builder()
                    .complaint(c3)
                    .assignedTo("Ramesh Kumar (AV Technician)")
                    .assignedBy("NIE Maintenance Admin")
                    .remarks("Replace 15m high-speed HDMI cable.")
                    .build());

            feedbackRepository.save(Feedback.builder()
                    .complaint(c3)
                    .user(student)
                    .rating(5)
                    .comments("Super quick resolution! The projector works with clear 1080p output now. Thank you!")
                    .build());

            // CF-1004: Water and Plumbing
            Complaint c4 = Complaint.builder()
                    .complaintNumber("CF-1004")
                    .institution(nie)
                    .campus(northCampus)
                    .building(b1)
                    .user(student)
                    .category("Water and Plumbing")
                    .problemTitle("Drinking water cooler filtration tap leakage")
                    .description("Continuous water dripping from the drinking water dispenser outlet on the second floor corridor near stairs.")
                    .roomLabNo("2nd Floor Corridor")
                    .priority(Priority.MEDIUM)
                    .status(ComplaintStatus.SUBMITTED)
                    .build();

            c4 = complaintRepository.save(c4);

            statusHistoryRepository.save(StatusHistory.builder()
                    .complaint(c4)
                    .previousStatus(null)
                    .newStatus("SUBMITTED")
                    .updatedBy("Prajwal Rao")
                    .remarks("Complaint submitted via Student Portal.")
                    .build());
        }

        log.info("CampusFix seeding completed successfully.");
    }
}
