package com.campusfix.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DuplicateMatchDto {
    private Long id;
    private String complaintNumber;
    private String problemTitle;
    private String category;
    private String buildingName;
    private String roomLabNo;
    private String status;
    private double similarityScore; // 0.0 - 1.0 (e.g. 0.85 = 85%)
    private String matchReason;
}
