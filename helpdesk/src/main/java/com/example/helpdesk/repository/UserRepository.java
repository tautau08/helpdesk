package com.example.helpdesk.repository;

import com.example.helpdesk.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Page<User> findByNameContainingIgnoreCaseAndIsActiveTrue(String name, Pageable pageable);

    Page<User> findByIsActiveTrue(Pageable pageable);

    Optional<User> findByUsernameIgnoreCase(String username);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Page<User> findByCompanyIdAndIsActiveTrue(Long companyId, Pageable pageable);

    Page<User> findByProjectIdAndIsActiveTrue(Long projectId, Pageable pageable);

    Page<User> findByDepartmentIdAndIsActiveTrue(Long departmentId, Pageable pageable);

    Page<User> findByRoleIdAndIsActiveTrue(Long roleId, Pageable pageable);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}

