package com.campusfix.repository;

import com.campusfix.model.Building;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BuildingRepository extends JpaRepository<Building, Long> {
    List<Building> findByCampusId(Long campusId);
    List<Building> findByCampusIdOrderByNameAsc(Long campusId);
}
