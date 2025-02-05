package com.eshop.Eshop.model;

import com.eshop.Eshop.model.enums.OrderStatus;
import com.eshop.Eshop.model.enums.PaymentType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Embedded
    private OrderAddress orderAddress;

    @OneToMany(mappedBy = "order", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private List<OrderPerStore> orderPerStores = new ArrayList<>();

    @Column(nullable = false)
    private Double grandPrice;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus; // PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED

    @Enumerated(EnumType.STRING)
    private PaymentType paymentType; // ONLINE, COD

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    public void addOrderPerStore(OrderPerStore orderPerStore) {
        orderPerStores.add(orderPerStore);
        orderPerStore.setOrder(this);
    }

    public void removeOrderPerStore(OrderPerStore orderPerStore) {
        orderPerStores.remove(orderPerStore);
        orderPerStore.setOrder(null);
    }
}
