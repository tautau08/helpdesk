package com.example.helpdesk.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class UserDto extends BaseDto {

    private String username;

    private String email;

    private Long companyId;

    private String companyName;

    private Long projectId;

    private String projectName;

    private Long departmentId;

    private String departmentName;

    private Long roleId;

    private String roleName;
}

