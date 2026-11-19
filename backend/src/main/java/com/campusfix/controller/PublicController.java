
package com.campusfix.controller;

import com.campusfix.dto.BuildingResponse;
import com.campusfix.dto.CampusResponse;
import com.campusfix.model.Building;
import com.campusfix.repository.BuildingRepository;
import com.campusfix.repository.CampusRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final CampusRepository campusRepository;
    private final BuildingRepository buildingRepository;

    // 1. Get all campuses
    @GetMapping("/campuses")
    public ResponseEntity<List<CampusResponse>> getCampuses() {

        List<CampusResponse> result = campusRepository.findAll()
                .stream()
                .map(c -> new CampusResponse(
                        c.getId(),
                        c.getName(),
                        c.getAddress()
                ))
                .toList();

        return ResponseEntity.ok(result);
    }

    // 2. Get buildings belonging to a particular campus
    @GetMapping("/campuses/{campusId}/buildings")
    public ResponseEntity<List<BuildingResponse>> getBuildingsByCampus(
            @PathVariable Long campusId) {

        List<BuildingResponse> result =
                buildingRepository.findByCampusIdOrderByNameAsc(campusId)
                        .stream()
                        .map(this::toBuildingResponse)
                        .toList();

        return ResponseEntity.ok(result);
    }

    // 3. Get all buildings
    @GetMapping("/buildings")
    public ResponseEntity<List<BuildingResponse>> getAllBuildings() {

        List<BuildingResponse> result = buildingRepository.findAll()
                .stream()
                .map(this::toBuildingResponse)
                .toList();

        return ResponseEntity.ok(result);
    }

    // Convert Building entity into BuildingResponse DTO
    private BuildingResponse toBuildingResponse(Building building) {

        return new BuildingResponse(
                building.getId(),
                building.getName(),
                building.getCode(),
                building.getCampus().getId()
        );
    }

    // 4. Get maintenance categories
    @GetMapping("/categories")
    public ResponseEntity<List<Map<String, Object>>> getCategories() {

        List<Map<String, Object>> categories = List.of(

                Map.of(
                        "name", "Wi-Fi and Network",
                        "description", "Wi-Fi not working, Slow internet, LAN issue, Router issue",
                        "subcategories", List.of(
                                "Wi-Fi not working",
                                "Slow internet",
                                "LAN issue",
                                "Router issue"
                        )
                ),

                Map.of(
                        "name", "Computer Laboratory",
                        "description", "Computer not starting, Monitor, Keyboard/mouse, Printer, Software",
                        "subcategories", List.of(
                                "Computer not starting",
                                "Monitor issue",
                                "Keyboard/mouse issue",
                                "Printer issue",
                                "Software issue"
                        )
                ),

                Map.of(
                        "name", "Electrical",
                        "description", "Lights, Fan, Switch/socket, AC issue",
                        "subcategories", List.of(
                                "Lights not working",
                                "Fan issue",
                                "Switch/socket issue",
                                "AC issue"
                        )
                ),

                Map.of(
                        "name", "Classroom Facilities",
                        "description", "Projector, Smart board, Speaker/microphone",
                        "subcategories", List.of(
                                "Projector issue",
                                "Smart board issue",
                                "Speaker/microphone issue"
                        )
                ),

                Map.of(
                        "name", "Furniture",
                        "description", "Broken desk, Damaged chair, Table/bench issue",
                        "subcategories", List.of(
                                "Broken desk",
                                "Damaged chair",
                                "Table/bench issue"
                        )
                ),

                Map.of(
                        "name", "Water and Plumbing",
                        "description", "Leakage, Tap issue, Drainage, Drinking water issue",
                        "subcategories", List.of(
                                "Leakage",
                                "Tap issue",
                                "Drainage issue",
                                "Drinking water issue"
                        )
                ),

                Map.of(
                        "name", "Washroom and Sanitation",
                        "description", "Hygiene, cleaning, flush or dispenser issues",
                        "subcategories", List.of(
                                "Flush malfunction",
                                "Hygiene/Sanitation",
                                "Dispenser broken",
                                "Water supply"
                        )
                ),

                Map.of(
                        "name", "Library Facilities",
                        "description", "Reading room lights, OPAC kiosks, shelving, book scanners",
                        "subcategories", List.of(
                                "OPAC Kiosk",
                                "Reading area lighting",
                                "Stack room issue"
                        )
                ),

                Map.of(
                        "name", "Laboratory Equipment",
                        "description", "Specialized lab instruments, multimeters, oscilloscopes, power supplies",
                        "subcategories", List.of(
                                "Power supply unit",
                                "Oscilloscope / Meter",
                                "Lab workstation bench"
                        )
                ),

                Map.of(
                        "name", "Doors and Windows",
                        "description", "Broken latch, lock jammed, door closer, window panes",
                        "subcategories", List.of(
                                "Lock jammed",
                                "Door closer loose",
                                "Glass pane crack"
                        )
                ),

                Map.of(
                        "name", "Lift and Common Areas",
                        "description", "Elevator buttons, corridor lights, staircase railing",
                        "subcategories", List.of(
                                "Lift maintenance",
                                "Corridor lights",
                                "Staircase safety"
                        )
                ),

                Map.of(
                        "name", "Other Facilities",
                        "description", "Any general maintenance requirement not covered above",
                        "subcategories", List.of(
                                "Other / General"
                        )
                )
        );

        return ResponseEntity.ok(categories);
    }
}
