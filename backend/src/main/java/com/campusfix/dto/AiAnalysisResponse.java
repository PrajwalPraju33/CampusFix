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
public class AiAnalysisResponse {
    private String problemTitle;
    private String category;
    private String suggestedPriority;
    private String maintenanceDepartment;
    private String summary;
    private String recommendedAction;
    private boolean duplicateWarning;
    private List<DuplicateMatchDto> potentialDuplicates;
}
