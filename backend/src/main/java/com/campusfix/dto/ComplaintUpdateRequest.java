package com.campusfix.dto;

import com.campusfix.model.Priority;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintUpdateRequest {
    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Problem title is required")
    private String problemTitle;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Room / Lab / Location is required")
    private String roomLabNo;

    private Priority priority;
}
