package com.example.helpdesk.dto;

import com.example.helpdesk.domain.EscalationType;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class EscalationMatrixDto extends BaseDto {

    private Long subcategoryId;

    private EscalationType type;

    private Integer from;

    private Integer to;

    private String email;
}
