package com.cauegallizzi.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record DeliveryAddressRequest(
        @NotBlank String street,
        @NotBlank String number,
        @NotBlank String neighborhood,
        @NotBlank String city,
        @NotBlank String state,
        @NotBlank String zipCode
) {
}
