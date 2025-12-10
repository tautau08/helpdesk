package com.example.helpdesk.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.Instant;

@Data
public abstract class BaseDto {

    private Long id;

    private String name;

    private Long createdUserId;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "UTC")
    private Instant createdTime;

    private Long updatedByUserId;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "UTC")
    private Instant updatedTime;

    private Integer sortOrder;

    private Boolean isActive;

}
