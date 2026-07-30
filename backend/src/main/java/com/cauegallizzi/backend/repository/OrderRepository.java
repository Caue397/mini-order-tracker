package com.cauegallizzi.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cauegallizzi.backend.entity.Order;

public interface OrderRepository extends JpaRepository<Order, UUID> {

    List<Order> findAllByOwnerId(UUID ownerId);

    Optional<Order> findByIdAndOwnerId(UUID id, UUID ownerId);
}
