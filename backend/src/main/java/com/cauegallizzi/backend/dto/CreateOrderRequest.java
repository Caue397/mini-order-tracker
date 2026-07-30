package com.cauegallizzi.backend.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record CreateOrderRequest(
        @NotBlank String customerName,
        @NotEmpty @Valid List<OrderItemRequest> items,
        @NotNull @Valid DeliveryAddressRequest deliveryAddress
) {
}
