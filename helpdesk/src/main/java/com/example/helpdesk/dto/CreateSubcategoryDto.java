package com.example.helpdesk.dto;

import lombok.Data;

@Data
public class CreateSubcategoryDto {

    private String name;

    private Long categoryId;

    private Integer sortOrder;

    private Boolean isActive;

    private Integer responseTime;

    private Integer resolutionTime;

    private Boolean isCustomerResponseRequired;
}
