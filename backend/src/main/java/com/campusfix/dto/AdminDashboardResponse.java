package com.campusfix.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private long totalComplaints;
    private long newComplaints;
    private long verifiedComplaints;
    private long assignedComplaints;
    private long inProgressComplaints;
    private long resolvedComplaints;
    private long closedComplaints;
    private long rejectedComplaints;
    private long onHoldComplaints;

    private Map<String, Long> priorityDistribution;
    private Map<String, Long> categoryDistribution;
    private List<ComplaintResponse> recentComplaints;
}
