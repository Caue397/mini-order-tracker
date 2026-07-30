package com.cauegallizzi.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import com.cauegallizzi.backend.entity.User;
import com.cauegallizzi.backend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class CurrentUserProviderTest {

    @Mock
    private UserRepository userRepository;

    private CurrentUserProvider currentUserProvider;

    @BeforeEach
    void setUp() {
        currentUserProvider = new CurrentUserProvider(userRepository);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getCurrentUser_returnsUserMatchingAuthenticatedEmail() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("caue@example.com");
        user.setName("Caue");
        user.setPassword("hash");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("caue@example.com", null));
        when(userRepository.findByEmail("caue@example.com")).thenReturn(Optional.of(user));

        User result = currentUserProvider.getCurrentUser();

        assertThat(result).isEqualTo(user);
    }

    @Test
    void getCurrentUser_whenUserNotFound_throwsIllegalStateException() {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("ghost@example.com", null));
        when(userRepository.findByEmail("ghost@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> currentUserProvider.getCurrentUser())
                .isInstanceOf(IllegalStateException.class);
    }
}
