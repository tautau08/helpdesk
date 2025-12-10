package com.example.helpdesk.repository;

import com.example.helpdesk.domain.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StatusRepository extends JpaRepository<Status, Long> {

    Optional<Status> findByNameIgnoreCase(String name);

    Page<Status> findByNameContainingIgnoreCaseAndIsActiveTrue(String name, Pageable pageable);

    Page<Status> findByIsActiveTrue(Pageable pageable);
}
