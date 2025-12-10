package com.example.helpdesk.config;

import com.example.helpdesk.domain.User;
import com.example.helpdesk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Provides the current authenticated user id for audit stamping.
 * First tries to resolve from SecurityContext (JWT); falls back to SYSTEM user id (1L).
 */
@Component
@RequiredArgsConstructor
public class AuditUserProvider {

    private final UserRepository userRepository;

    public Long getCurrentUserIdOrSystem() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getDetails() instanceof Long uid) {
            return uid;
        }
        // Fallback to system
        return userRepository.findByUsername("system")
                .map(User::getId)
                .orElse(1L);
    }
}
