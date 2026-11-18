package com.campusfix.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignRequest {
    @NotBlank(message = "Assigned technician/personnel name is required")
    private String assignedTo;

    private String remarks;
}
