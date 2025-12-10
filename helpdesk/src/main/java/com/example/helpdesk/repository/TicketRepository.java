package com.example.helpdesk.repository;

import com.example.helpdesk.domain.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @Query("SELECT t FROM Ticket t " +
           "JOIN FETCH t.company " +
           "JOIN FETCH t.category " +
           "JOIN FETCH t.subcategory " +
           "JOIN FETCH t.submittedStatus " +
           "JOIN FETCH t.currentStatus " +
           "JOIN FETCH t.priority " +
           "JOIN FETCH t.serviceType")
    Page<Ticket> findAllWithRelations(Pageable pageable);

    @Query("SELECT t FROM Ticket t " +
           "JOIN FETCH t.company " +
           "JOIN FETCH t.category " +
           "JOIN FETCH t.subcategory " +
           "JOIN FETCH t.submittedStatus " +
           "JOIN FETCH t.currentStatus " +
           "JOIN FETCH t.priority " +
           "JOIN FETCH t.serviceType WHERE t.id = :id")
    Optional<Ticket> findByIdWithRelations(@Param("id") Long id);

    @Query("SELECT t FROM Ticket t " +
           "JOIN FETCH t.company " +
           "JOIN FETCH t.category " +
           "JOIN FETCH t.subcategory " +
           "JOIN FETCH t.submittedStatus " +
           "JOIN FETCH t.currentStatus " +
           "JOIN FETCH t.priority " +
           "JOIN FETCH t.serviceType WHERE t.createdUserId = :userId AND t.isActive = true")
    Page<Ticket> findByCreatedUserIdAndIsActiveTrueWithRelations(@Param("userId") Long userId, Pageable pageable);
}
