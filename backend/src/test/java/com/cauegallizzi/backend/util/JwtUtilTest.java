package com.cauegallizzi.backend.util;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import io.jsonwebtoken.ExpiredJwtException;

class JwtUtilTest {

    private static final String SECRET = "test-secret-1f4a6d3c8b2e9f7a5d1c4b8e2f9a6d3c8b2e9f7a5d1c4b8e2f9a6d3c8b2e9f7a";

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil(SECRET, 3600000);
    }

    private UserDetails userDetails(String email) {
        return User.builder().username(email).password("irrelevant").authorities("USER").build();
    }

    @Test
    void generateToken_thenExtractEmail_returnsSameEmail() {
        UserDetails user = userDetails("caue@example.com");

        String token = jwtUtil.generateToken(user);

        assertThat(jwtUtil.extractEmail(token)).isEqualTo("caue@example.com");
    }

    @Test
    void isTokenValid_withMatchingUser_returnsTrue() {
        UserDetails user = userDetails("caue@example.com");
        String token = jwtUtil.generateToken(user);

        assertThat(jwtUtil.isTokenValid(token, user)).isTrue();
    }

    @Test
    void isTokenValid_withDifferentUser_returnsFalse() {
        UserDetails owner = userDetails("caue@example.com");
        UserDetails another = userDetails("outro@example.com");
        String token = jwtUtil.generateToken(owner);

        assertThat(jwtUtil.isTokenValid(token, another)).isFalse();
    }

    @Test
    void isTokenValid_withExpiredToken_throwsExpiredJwtException() {
        JwtUtil shortLivedJwtUtil = new JwtUtil(SECRET, -1000);
        UserDetails user = userDetails("caue@example.com");
        String token = shortLivedJwtUtil.generateToken(user);

        assertThatThrownBy(() -> shortLivedJwtUtil.isTokenValid(token, user))
                .isInstanceOf(ExpiredJwtException.class);
    }
}
