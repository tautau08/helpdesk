package com.example.helpdesk.repository;

import com.example.helpdesk.domain.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByNameIgnoreCase(String name);

    Page<Company> findByNameContainingIgnoreCaseAndIsActiveTrue(String name, Pageable pageable);

    Page<Company> findByIsActiveTrue(Pageable pageable);
}
