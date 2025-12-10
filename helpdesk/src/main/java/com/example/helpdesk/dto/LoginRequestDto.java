package com.example.helpdesk.dto;

import lombok.Getter;
import lombok.Setter;

// Simple login request DTO
@Getter
@Setter
public class LoginRequestDto {
    private String username;
    private String password;
}

