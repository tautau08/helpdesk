package com.example.helpdesk.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * JWT Token Provider - Simplified Best Practice
 *
 * Purpose: Creates and validates JWT tokens
 *
 * What it does:
 * 1. generateToken() - Creates JWT with username, userId, and roles
 * 2. parseClaims() - Validates token and extracts claims
 * 3. getUserId() - Extracts user ID from token
 * 4. getRoles() - Extracts roles from token
 */
@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final long accessTtlSeconds;

    public JwtTokenProvider(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.access-ttl-seconds}") long accessTtlSeconds) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTtlSeconds = accessTtlSeconds;
    }

    /**
     * Generate JWT token with user details and roles
     * @param userId User's database ID
     * @param username User's username
     * @param roles List of role names (e.g., ["ADMIN", "USER"])
     * @return JWT token string
     */
    public String generateToken(Long userId, String username, List<String> roles) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(accessTtlSeconds);
        return Jwts.builder()
                .subject(username)
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .claims(Map.of(
                        "uid", userId,
                        "roles", roles
                ))
                .signWith(key)
                .compact();
    }

    /**
     * Parse and validate JWT token
     * @param token JWT token string
     * @return Claims object containing token data
     * @throws io.jsonwebtoken.JwtException if token is invalid or expired
     */
    public Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Extract user ID from claims
     */
    public Long getUserId(Claims claims) {
        Object uid = claims.get("uid");
        if (uid instanceof Number n) return n.longValue();
        if (uid instanceof String s) return Long.parseLong(s);
        return null;
    }

    /**
     * Extract roles from claims
     */
    public List<String> getRoles(Claims claims) {
        Object roles = claims.get("roles");
        if (roles instanceof List<?> list) {
            return list.stream().map(String::valueOf).toList();
        }
        return List.of();
    }
}
