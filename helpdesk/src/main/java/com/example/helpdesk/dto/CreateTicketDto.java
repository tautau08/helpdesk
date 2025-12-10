package com.example.helpdesk.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class CreateTicketDto {

    private String name;

    private Long companyId;

    private Long categoryId;

    private Long subcategoryId;

    private Long statusId; // This will be set as both submittedStatus and currentStatus on creation

    private Long priorityId;

    private Long serviceTypeId;

    private String description;

    private Integer sortOrder;

    private Boolean isActive;

    private List<String> imageUrls;

    private List<MultipartFile> images;
}
