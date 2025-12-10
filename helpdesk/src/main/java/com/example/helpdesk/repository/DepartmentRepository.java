package com.example.helpdesk.repository;

import com.example.helpdesk.domain.Department;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {

    @Query("SELECT d FROM Department d WHERE (:name IS NULL OR LOWER(d.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND (:isActive IS NULL OR d.isActive = :isActive)")
    Page<Department> findAllFiltered(@Param("name") String name, @Param("isActive") Boolean isActive, Pageable pageable);
}
