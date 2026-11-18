package com.campusfix.repository;

import com.campusfix.model.Complaint;
import com.campusfix.model.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    List<Complaint> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Complaint> findByIdAndUserId(Long id, Long userId);

    Optional<Complaint> findByComplaintNumber(String complaintNumber);

    List<Complaint> findAllByOrderByCreatedAtDesc();

    List<Complaint> findByCampusIdOrderByCreatedAtDesc(Long campusId);

    long countByStatus(ComplaintStatus status);

    long countByCampusId(Long campusId);

    long countByCampusIdAndStatus(Long campusId, ComplaintStatus status);

    @Query("SELECT c FROM Complaint c ORDER BY c.id DESC LIMIT 1")
    Optional<Complaint> findLatestComplaint();

    // Duplicate detection queries
    List<Complaint> findByCampusIdAndBuildingIdAndRoomLabNoIgnoreCaseAndStatusNotIn(
            Long campusId, Long buildingId, String roomLabNo, Collection<ComplaintStatus> statuses);

    List<Complaint> findByCampusIdAndBuildingIdAndStatusNotIn(
            Long campusId, Long buildingId, Collection<ComplaintStatus> statuses);

    @Query("SELECT c FROM Complaint c WHERE " +
           "(:campusId IS NULL OR c.campus.id = :campusId) AND " +
           "(:buildingId IS NULL OR c.building.id = :buildingId) AND " +
           "(:category IS NULL OR c.category = :category) AND " +
           "(:status IS NULL OR c.status = :status) " +
           "ORDER BY c.createdAt DESC")
    List<Complaint> filterComplaints(
            @Param("campusId") Long campusId,
            @Param("buildingId") Long buildingId,
            @Param("category") String category,
            @Param("status") ComplaintStatus status);
}
