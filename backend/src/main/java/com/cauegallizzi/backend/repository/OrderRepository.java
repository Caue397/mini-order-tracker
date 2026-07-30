package com.cauegallizzi.backend.repository;

import java.util.UUID;

import com.cauegallizzi.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, UUID> {
}
