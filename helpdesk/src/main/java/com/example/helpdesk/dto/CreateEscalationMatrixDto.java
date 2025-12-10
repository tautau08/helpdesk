package com.example.helpdesk.dto;

import com.example.helpdesk.domain.EscalationType;
import lombok.Data;

@Data
public class CreateEscalationMatrixDto {

    private Long subcategoryId;

    private EscalationType type;

    private Integer from;

    private Integer to;

    private String email;
}
