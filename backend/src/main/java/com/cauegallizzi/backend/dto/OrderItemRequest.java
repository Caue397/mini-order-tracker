package com.cauegallizzi.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record OrderItemRequest(
        @NotBlank String productName,
        @NotNull @Min(1) Integer quantity
) {
}
