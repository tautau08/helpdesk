package com.example.helpdesk.service;

import com.example.helpdesk.config.security.JwtTokenProvider;
import com.example.helpdesk.domain.User;
import com.example.helpdesk.dto.LoginRequestDto;
import com.example.helpdesk.dto.LoginResponseDto;
import com.example.helpdesk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional(readOnly = true)
    public LoginResponseDto login(LoginRequestDto dto) {
        User user = userRepository.findByUsernameIgnoreCase(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new RuntimeException("User inactive");
        }

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String roleName = user.getRole() != null ? user.getRole().getName() : "USER";
        String token = jwtTokenProvider.generateToken(user.getId(), user.getUsername(), List.of(roleName));

        LoginResponseDto res = new LoginResponseDto();
        res.setToken(token);
        res.setUserId(user.getId());
        res.setUsername(user.getUsername());
        res.setRoleName(roleName);
        return res;
    }
}

