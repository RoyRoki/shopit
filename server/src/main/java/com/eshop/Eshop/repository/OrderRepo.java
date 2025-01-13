package com.eshop.Eshop.repository;

import com.eshop.Eshop.model.Order;
import com.eshop.Eshop.model.User;
import com.eshop.Eshop.model.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepo extends JpaRepository<Order, Long> {
    List<Order> findAllByUser(User user);
    List<Order> findAllByUserAndOrderStatus(User user, OrderStatus orderStatus);
}
