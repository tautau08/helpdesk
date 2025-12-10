package com.example.helpdesk.dto;

import lombok.Getter;
import lombok.Setter;

// Simple login response DTO
@Getter
@Setter
public class LoginResponseDto {
    private String token;
    private Long userId;
    private String username;
    private String roleName;
}

