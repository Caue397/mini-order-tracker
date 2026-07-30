package com.cauegallizzi.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cauegallizzi.backend.dto.UserResponse;
import com.cauegallizzi.backend.entity.User;
import com.cauegallizzi.backend.service.CurrentUserProvider;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final CurrentUserProvider currentUserProvider;

    public UserController(CurrentUserProvider currentUserProvider) {
        this.currentUserProvider = currentUserProvider;
    }

    @GetMapping("/me")
    public UserResponse me() {
        User user = currentUserProvider.getCurrentUser();
        return new UserResponse(user.getId(), user.getName(), user.getEmail());
    }
}
