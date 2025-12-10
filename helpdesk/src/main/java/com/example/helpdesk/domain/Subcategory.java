package com.example.helpdesk.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "subcategories")
@Getter
@Setter
public class Subcategory extends BaseAuditable {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "response_time")
    private Integer responseTime;

    @Column(name = "resolution_time")
    private Integer resolutionTime;

    @Column(name = "is_customer_response_required")
    private Boolean isCustomerResponseRequired;

    @OneToMany(mappedBy = "subcategory", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<EscalationMatrix> escalationMatrices = new ArrayList<>();
}
