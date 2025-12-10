package com.example.helpdesk.dto;

import lombok.Data;

@Data
public class CreateProjectDto {
    private String name;
    private Long companyId;
    private Integer sortOrder;
    private Boolean isActive;
}
