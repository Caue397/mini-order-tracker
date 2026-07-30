package com.cauegallizzi.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.cauegallizzi.backend.dto.AuthResponse;
import com.cauegallizzi.backend.dto.LoginRequest;
import com.cauegallizzi.backend.dto.RegisterRequest;
import com.cauegallizzi.backend.exception.EmailAlreadyInUseException;
import com.cauegallizzi.backend.repository.UserRepository;
import com.cauegallizzi.backend.util.JwtUtil;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserDetailsServiceImpl userDetailsService;

    @Mock
    private JwtUtil jwtUtil;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, passwordEncoder, authenticationManager, userDetailsService, jwtUtil);
    }

    @Test
    void register_withNewEmail_savesUserAndReturnsToken() {
        RegisterRequest request = new RegisterRequest("Caue", "caue@example.com", "senha12345");
        UserDetails userDetails = User.builder().username("caue@example.com").password("hash").authorities("USER").build();

        when(userRepository.existsByEmail("caue@example.com")).thenReturn(false);
        when(passwordEncoder.encode("senha12345")).thenReturn("hashed-password");
        when(userDetailsService.loadUserByUsername("caue@example.com")).thenReturn(userDetails);
        when(jwtUtil.generateToken(userDetails)).thenReturn("jwt-token");

        AuthResponse response = authService.register(request);

        assertThat(response.token()).isEqualTo("jwt-token");
        verify(userRepository).save(argThat(user ->
                user.getEmail().equals("caue@example.com")
                        && user.getName().equals("Caue")
                        && user.getPassword().equals("hashed-password")));
    }

    @Test
    void register_withExistingEmail_throwsEmailAlreadyInUseException() {
        RegisterRequest request = new RegisterRequest("Caue", "caue@example.com", "senha12345");
        when(userRepository.existsByEmail("caue@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(EmailAlreadyInUseException.class);

        verify(userRepository, never()).save(any());
    }

    @Test
    void login_withValidCredentials_returnsToken() {
        LoginRequest request = new LoginRequest("caue@example.com", "senha12345");
        UserDetails userDetails = User.builder().username("caue@example.com").password("hash").authorities("USER").build();

        when(userDetailsService.loadUserByUsername("caue@example.com")).thenReturn(userDetails);
        when(jwtUtil.generateToken(userDetails)).thenReturn("jwt-token");

        AuthResponse response = authService.login(request);

        assertThat(response.token()).isEqualTo("jwt-token");
        verify(authenticationManager).authenticate(any());
    }
}
