package com.cauegallizzi.backend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.cauegallizzi.backend.dto.CreateOrderRequest;
import com.cauegallizzi.backend.dto.DeliveryAddressResponse;
import com.cauegallizzi.backend.dto.OrderItemRequest;
import com.cauegallizzi.backend.dto.OrderItemResponse;
import com.cauegallizzi.backend.dto.OrderResponse;
import com.cauegallizzi.backend.dto.UpdateOrderStatusRequest;
import com.cauegallizzi.backend.entity.DeliveryAddress;
import com.cauegallizzi.backend.entity.Order;
import com.cauegallizzi.backend.entity.OrderItem;
import com.cauegallizzi.backend.entity.User;
import com.cauegallizzi.backend.exception.OrderNotFoundException;
import com.cauegallizzi.backend.repository.OrderRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CurrentUserProvider currentUserProvider;

    public OrderService(OrderRepository orderRepository, CurrentUserProvider currentUserProvider) {
        this.orderRepository = orderRepository;
        this.currentUserProvider = currentUserProvider;
    }

    public OrderResponse create(CreateOrderRequest request) {
        User currentUser = currentUserProvider.getCurrentUser();

        Order order = new Order();
        order.setCustomerName(request.customerName());
        order.setDeliveryAddress(new DeliveryAddress(
                request.deliveryAddress().street(),
                request.deliveryAddress().number(),
                request.deliveryAddress().city(),
                request.deliveryAddress().state(),
                request.deliveryAddress().zipCode()));
        order.setOwner(currentUser);

        for (OrderItemRequest itemRequest : request.items()) {
            OrderItem item = new OrderItem();
            item.setProductName(itemRequest.productName());
            item.setQuantity(itemRequest.quantity());
            order.addItem(item);
        }

        orderRepository.save(order);
        return toResponse(order);
    }

    public List<OrderResponse> findAll() {
        User currentUser = currentUserProvider.getCurrentUser();
        return orderRepository.findAllByOwnerId(currentUser.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public OrderResponse findById(UUID id) {
        return toResponse(getOwnedOrder(id));
    }

    public OrderResponse updateStatus(UUID id, UpdateOrderStatusRequest request) {
        Order order = getOwnedOrder(id);
        order.setStatus(request.status());
        orderRepository.save(order);
        return toResponse(order);
    }

    public void delete(UUID id) {
        orderRepository.delete(getOwnedOrder(id));
    }

    private Order getOwnedOrder(UUID id) {
        User currentUser = currentUserProvider.getCurrentUser();
        return orderRepository.findByIdAndOwnerId(id, currentUser.getId())
                .orElseThrow(() -> new OrderNotFoundException(id));
    }

    private OrderResponse toResponse(Order order) {
        DeliveryAddress address = order.getDeliveryAddress();
        DeliveryAddressResponse addressResponse = new DeliveryAddressResponse(
                address.getStreet(), address.getNumber(), address.getCity(), address.getState(), address.getZipCode());

        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> new OrderItemResponse(item.getId(), item.getProductName(), item.getQuantity()))
                .toList();

        return new OrderResponse(order.getId(), order.getCustomerName(), addressResponse, order.getStatus(), itemResponses);
    }
}
