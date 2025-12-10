package com.example.helpdesk.dto;

import lombok.Data;

@Data
public class CreateDepartmentDto {
    private String name;
    private Integer sortOrder;
    private Boolean isActive;
}
