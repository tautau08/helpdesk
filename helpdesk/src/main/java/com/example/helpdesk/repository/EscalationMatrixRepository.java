package com.example.helpdesk.repository;

import com.example.helpdesk.domain.EscalationMatrix;
import com.example.helpdesk.domain.EscalationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EscalationMatrixRepository extends JpaRepository<EscalationMatrix, Long> {

    List<EscalationMatrix> findBySubcategoryIdAndType(Long subcategoryId, EscalationType type);

    @Query("SELECT em FROM EscalationMatrix em WHERE em.subcategory.id = :subcategoryId AND em.type = :type AND ((em.from <= :to AND em.to >= :from))")
    List<EscalationMatrix> findOverlappingRanges(@Param("subcategoryId") Long subcategoryId,
                                                 @Param("type") EscalationType type,
                                                 @Param("from") Integer from,
                                                 @Param("to") Integer to);
}
