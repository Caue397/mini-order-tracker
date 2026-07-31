package com.cauegallizzi.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.cauegallizzi.backend.dto.CreateOrderRequest;
import com.cauegallizzi.backend.dto.DeliveryAddressRequest;
import com.cauegallizzi.backend.dto.OrderItemRequest;
import com.cauegallizzi.backend.dto.OrderResponse;
import com.cauegallizzi.backend.dto.UpdateOrderStatusRequest;
import com.cauegallizzi.backend.entity.DeliveryAddress;
import com.cauegallizzi.backend.entity.Order;
import com.cauegallizzi.backend.entity.OrderItem;
import com.cauegallizzi.backend.entity.OrderStatus;
import com.cauegallizzi.backend.entity.User;
import com.cauegallizzi.backend.exception.OrderNotFoundException;
import com.cauegallizzi.backend.repository.OrderRepository;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CurrentUserProvider currentUserProvider;

    private OrderService orderService;

    private User owner;

    @BeforeEach
    void setUp() {
        orderService = new OrderService(orderRepository, currentUserProvider);

        owner = new User();
        owner.setId(UUID.randomUUID());
        owner.setEmail("caue@example.com");
        owner.setName("Caue");
        owner.setPassword("hash");
    }

    private CreateOrderRequest createOrderRequest() {
        return new CreateOrderRequest(
                "João da Silva",
                List.of(new OrderItemRequest("Pizza", 1), new OrderItemRequest("Refrigerante", 2)),
                new DeliveryAddressRequest("Rua das Flores", "123", "São Paulo", "SP", "01234-567"));
    }

    @Test
    void create_buildsOrderWithItemsAndOwnerAndDefaultStatus() {
        when(currentUserProvider.getCurrentUser()).thenReturn(owner);

        OrderResponse response = orderService.create(createOrderRequest());

        assertThat(response.customerName()).isEqualTo("João da Silva");
        assertThat(response.status()).isEqualTo(OrderStatus.RECEBIDO);
        assertThat(response.items()).hasSize(2);
        assertThat(response.deliveryAddress().city()).isEqualTo("São Paulo");

        verify(orderRepository).save(org.mockito.ArgumentMatchers.argThat(order ->
                order.getOwner().equals(owner) && order.getItems().size() == 2));
    }

    @Test
    void findAll_returnsOnlyOrdersOwnedByCurrentUser() {
        when(currentUserProvider.getCurrentUser()).thenReturn(owner);
        Order order = buildOrder(owner);
        when(orderRepository.findAllByOwnerId(owner.getId())).thenReturn(List.of(order));

        List<OrderResponse> result = orderService.findAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).id()).isEqualTo(order.getId());
    }

    @Test
    void findById_whenOrderBelongsToCurrentUser_returnsIt() {
        when(currentUserProvider.getCurrentUser()).thenReturn(owner);
        Order order = buildOrder(owner);
        when(orderRepository.findByIdAndOwnerId(order.getId(), owner.getId())).thenReturn(Optional.of(order));

        OrderResponse response = orderService.findById(order.getId());

        assertThat(response.id()).isEqualTo(order.getId());
    }

    @Test
    void findById_whenOrderDoesNotBelongToCurrentUser_throwsOrderNotFoundException() {
        when(currentUserProvider.getCurrentUser()).thenReturn(owner);
        UUID otherOrderId = UUID.randomUUID();
        when(orderRepository.findByIdAndOwnerId(otherOrderId, owner.getId())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.findById(otherOrderId))
                .isInstanceOf(OrderNotFoundException.class);
    }

    @Test
    void update_replacesCustomerNameAddressAndItems() {
        when(currentUserProvider.getCurrentUser()).thenReturn(owner);
        Order order = buildOrder(owner);
        when(orderRepository.findByIdAndOwnerId(order.getId(), owner.getId())).thenReturn(Optional.of(order));

        CreateOrderRequest updateRequest = new CreateOrderRequest(
                "Maria Souza",
                List.of(new OrderItemRequest("Hamburguer", 3)),
                new DeliveryAddressRequest("Av Paulista", "1000", "São Paulo", "SP", "01310-100"));

        OrderResponse response = orderService.update(order.getId(), updateRequest);

        assertThat(response.customerName()).isEqualTo("Maria Souza");
        assertThat(response.deliveryAddress().street()).isEqualTo("Av Paulista");
        assertThat(response.items()).hasSize(1);
        assertThat(response.items().get(0).productName()).isEqualTo("Hamburguer");
        assertThat(response.status()).isEqualTo(OrderStatus.RECEBIDO);
        verify(orderRepository).save(order);
    }

    @Test
    void update_whenOrderNotOwned_throwsOrderNotFoundException() {
        when(currentUserProvider.getCurrentUser()).thenReturn(owner);
        UUID otherOrderId = UUID.randomUUID();
        when(orderRepository.findByIdAndOwnerId(otherOrderId, owner.getId())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.update(otherOrderId, createOrderRequest()))
                .isInstanceOf(OrderNotFoundException.class);

        verify(orderRepository, org.mockito.Mockito.never()).save(any());
    }

    @Test
    void updateStatus_updatesAndPersistsNewStatus() {
        when(currentUserProvider.getCurrentUser()).thenReturn(owner);
        Order order = buildOrder(owner);
        when(orderRepository.findByIdAndOwnerId(order.getId(), owner.getId())).thenReturn(Optional.of(order));

        OrderResponse response = orderService.updateStatus(order.getId(), new UpdateOrderStatusRequest(OrderStatus.EM_PREPARO));

        assertThat(response.status()).isEqualTo(OrderStatus.EM_PREPARO);
        verify(orderRepository).save(order);
    }

    @Test
    void updateStatus_whenOrderNotOwned_throwsOrderNotFoundException() {
        when(currentUserProvider.getCurrentUser()).thenReturn(owner);
        UUID otherOrderId = UUID.randomUUID();
        when(orderRepository.findByIdAndOwnerId(otherOrderId, owner.getId())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.updateStatus(otherOrderId, new UpdateOrderStatusRequest(OrderStatus.CANCELADO)))
                .isInstanceOf(OrderNotFoundException.class);

        verify(orderRepository, org.mockito.Mockito.never()).save(any());
    }

    @Test
    void delete_removesOwnedOrder() {
        when(currentUserProvider.getCurrentUser()).thenReturn(owner);
        Order order = buildOrder(owner);
        when(orderRepository.findByIdAndOwnerId(order.getId(), owner.getId())).thenReturn(Optional.of(order));

        orderService.delete(order.getId());

        verify(orderRepository).delete(order);
    }

    @Test
    void delete_whenOrderNotOwned_throwsOrderNotFoundException() {
        when(currentUserProvider.getCurrentUser()).thenReturn(owner);
        UUID otherOrderId = UUID.randomUUID();
        when(orderRepository.findByIdAndOwnerId(otherOrderId, owner.getId())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.delete(otherOrderId))
                .isInstanceOf(OrderNotFoundException.class);
    }

    private Order buildOrder(User owner) {
        Order order = new Order();
        order.setId(UUID.randomUUID());
        order.setCustomerName("João da Silva");
        order.setDeliveryAddress(new DeliveryAddress("Rua das Flores", "123", "São Paulo", "SP", "01234-567"));
        order.setOwner(owner);

        OrderItem item = new OrderItem();
        item.setId(UUID.randomUUID());
        item.setProductName("Pizza");
        item.setQuantity(1);
        order.addItem(item);

        return order;
    }
}
