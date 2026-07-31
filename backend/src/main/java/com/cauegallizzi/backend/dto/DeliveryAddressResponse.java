package com.cauegallizzi.backend.dto;

public record DeliveryAddressResponse(
        String street, String number, String neighborhood, String city, String state, String zipCode) {
}
