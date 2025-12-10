package com.example.helpdesk.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "escalation_matrices")
@Data
@EqualsAndHashCode(callSuper = true)
public class EscalationMatrix extends BaseAuditable {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "subcategory_id", nullable = false)
    private Subcategory subcategory;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EscalationType type;

    @Column(name = "from_value", nullable = false)
    private Integer from;

    @Column(name = "to_value", nullable = false)
    private Integer to;

    @Column(nullable = false)
    private String email;
}
