package com.campusfix;

import com.campusfix.dto.DuplicateCheckRequest;
import com.campusfix.dto.DuplicateCheckResponse;
import com.campusfix.duplicate.DuplicateDetectionService;
import com.campusfix.model.Building;
import com.campusfix.model.Campus;
import com.campusfix.repository.BuildingRepository;
import com.campusfix.repository.CampusRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class DuplicateDetectionTests {

    @Autowired
    private DuplicateDetectionService duplicateDetectionService;

    @Autowired
    private CampusRepository campusRepository;

    @Autowired
    private BuildingRepository buildingRepository;

    @Test
    @DisplayName("Should detect duplicate when reporting same issue in the same room")
    void testDetectDuplicateComplaint() {
        Campus campus = campusRepository.findAll().get(0);
        // Sankaracharya Bhavan has seeded CF-1001 for Lab 204 (Wi-Fi issue)
        Building building = buildingRepository.findByCampusId(campus.getId()).get(0);

        DuplicateCheckRequest request = DuplicateCheckRequest.builder()
                .campusId(campus.getId())
                .buildingId(building.getId())
                .roomLabNo("Lab 204")
                .category("Wi-Fi and Network")
                .description("Wi-Fi is not connecting in Lab 204, router LED is blinking red")
                .build();

        DuplicateCheckResponse response = duplicateDetectionService.checkDuplicates(request);

        assertTrue(response.isHasDuplicates());
        assertFalse(response.getDuplicates().isEmpty());
        assertEquals("CF-1001", response.getDuplicates().get(0).getComplaintNumber());
        assertTrue(response.getDuplicates().get(0).getSimilarityScore() >= 0.50);
    }
}
