package com.cauegallizzi.backend.dto;

import com.cauegallizzi.backend.entity.OrderStatus;

import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(@NotNull OrderStatus status) {
}
