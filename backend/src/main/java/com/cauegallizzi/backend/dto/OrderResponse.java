package com.cauegallizzi.backend.dto;

import java.util.List;
import java.util.UUID;

import com.cauegallizzi.backend.entity.OrderStatus;

public record OrderResponse(
        UUID id,
        String customerName,
        DeliveryAddressResponse deliveryAddress,
        OrderStatus status,
        List<OrderItemResponse> items
) {
}
