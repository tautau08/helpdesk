package com.example.helpdesk.repository;

import com.example.helpdesk.domain.Menu;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {

    Optional<Menu> findByNameIgnoreCase(String name);

    Page<Menu> findByNameContainingIgnoreCaseAndIsActiveTrue(String name, Pageable pageable);

    Page<Menu> findByIsActiveTrue(Pageable pageable);

    Page<Menu> findByNameContainingIgnoreCaseAndIsActiveFalse(String name, Pageable pageable);

    Page<Menu> findByIsActiveFalse(Pageable pageable);
}
