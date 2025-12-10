package com.example.helpdesk.repository;

import com.example.helpdesk.domain.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    Page<Role> findByNameContainingIgnoreCaseAndIsActiveTrue(String name, Pageable pageable);

    Page<Role> findByIsActiveTrue(Pageable pageable);

    Optional<Role> findByNameIgnoreCase(String name);

    Page<Role> findByNameContainingIgnoreCaseAndIsActiveFalse(String name, Pageable pageable);

    Page<Role> findByIsActiveFalse(Pageable pageable);
}
