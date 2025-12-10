package com.example.helpdesk.dto;

import lombok.Data;

@Data
public class CreateCategoryDto {
    private String name;
    private Long projectId;
    private Integer sortOrder;
    private Boolean isActive;
}
