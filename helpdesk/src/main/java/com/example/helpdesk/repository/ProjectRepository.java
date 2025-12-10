package com.example.helpdesk.repository;

import com.example.helpdesk.domain.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    Optional<Project> findByNameIgnoreCase(String name);

    Page<Project> findByNameContainingIgnoreCaseAndIsActiveTrue(String name, Pageable pageable);

    Page<Project> findByIsActiveTrue(Pageable pageable);

    List<Project> findByCompanyIdAndIsActiveTrue(Long companyId);

    Page<Project> findByCompanyIdAndIsActiveTrue(Long companyId, Pageable pageable);

    long countByCompanyId(Long companyId);
}
