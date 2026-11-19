package com.campusfix.dto;

public record BuildingResponse(
    Long id,
    String name,
    String code,
    Long campusId
) {}