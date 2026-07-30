package com.cauegallizzi.backend.dto;

import java.util.UUID;

public record OrderItemResponse(UUID id, String productName, Integer quantity) {
}
