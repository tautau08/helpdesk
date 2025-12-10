package com.example.helpdesk.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;


@Data
@EqualsAndHashCode(callSuper = true)
public class TicketDto extends BaseDto {

    private String name;

    private Long companyId;
    private String companyName;

    private Long categoryId;
    private String categoryName;

    private Long subcategoryId;
    private String subcategoryName;

    private Long submittedStatusId;
    private String submittedStatusName;

    private Long currentStatusId;
    private String currentStatusName;

    private Long priorityId;
    private String priorityName;

    private Long serviceTypeId;
    private String serviceTypeName;

    private String description;

    private List<String> imageUrls;

}
