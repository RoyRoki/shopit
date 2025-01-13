package com.eshop.Eshop.repository;

import com.eshop.Eshop.model.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentOrderRepo extends JpaRepository<PaymentOrder, Long> {
    PaymentOrder findByOrderId(String orderId);
}
