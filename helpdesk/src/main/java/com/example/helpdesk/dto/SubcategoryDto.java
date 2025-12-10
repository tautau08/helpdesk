package com.example.helpdesk.dto;

import lombok.Data;

@Data
public class SubcategoryDto extends BaseDto {

    private Long categoryId;

    private Integer responseTime;

    private Integer resolutionTime;

    private Boolean isCustomerResponseRequired;
}
