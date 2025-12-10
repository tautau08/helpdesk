package com.example.helpdesk.dto;

import lombok.Data;

@Data
public class CreatePriorityListDto {
    private String name;
    private Integer sortOrder;
    private Boolean isActive;
}
