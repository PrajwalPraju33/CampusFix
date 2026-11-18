package com.campusfix.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DuplicateCheckRequest {
    private Long campusId;
    private Long buildingId;
    private String roomLabNo;
    private String category;
    private String description;
}
