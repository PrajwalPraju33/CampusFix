package com.campusfix.dto;

import com.campusfix.model.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintCreateRequest {
    @NotNull(message = "Campus is required")
    private Long campusId;

    @NotNull(message = "Building is required")
    private Long buildingId;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Problem title is required")
    private String problemTitle;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Room / Lab / Location is required")
    private String roomLabNo;

    private Priority priority;

    private List<String> attachmentPaths;
}
