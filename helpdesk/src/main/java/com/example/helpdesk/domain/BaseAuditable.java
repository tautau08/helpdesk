package com.example.helpdesk.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.Instant;

@Data
@MappedSuperclass
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public abstract class BaseAuditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "name", length = 150, nullable = false)
    private String name;

    @Column(name = "created_user_id", nullable = true)
    private Long createdUserId;

    @Column(name = "created_time", nullable = false)
    private Instant createdTime;

    @Column(name = "updated_by_user_id", nullable = true)
    private Long updatedByUserId;

    @Column(name = "updated_time")
    private Instant updatedTime;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @PrePersist
    protected void onCreate() {
        final Instant now = Instant.now();
        if (createdTime == null) createdTime = now;
        if (sortOrder == null) sortOrder = 0;
        if (isActive == null) isActive = Boolean.TRUE;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedTime = Instant.now();
    }
}
