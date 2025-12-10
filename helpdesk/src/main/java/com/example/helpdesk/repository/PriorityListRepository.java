package com.example.helpdesk.repository;

import com.example.helpdesk.domain.PriorityList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PriorityListRepository extends JpaRepository<PriorityList, Long> {

    Page<PriorityList> findByIsActiveTrue(Pageable pageable);
}
