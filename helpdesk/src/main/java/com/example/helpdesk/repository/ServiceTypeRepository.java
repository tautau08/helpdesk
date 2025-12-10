package com.example.helpdesk.repository;

import com.example.helpdesk.domain.ServiceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ServiceTypeRepository extends JpaRepository<ServiceType, Long> {

    Optional<ServiceType> findByNameIgnoreCase(String name);

    Page<ServiceType> findByNameContainingIgnoreCaseAndIsActiveTrue(String name, Pageable pageable);

    Page<ServiceType> findByIsActiveTrue(Pageable pageable);
}
