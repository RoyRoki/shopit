package com.eshop.Eshop.service.Interface;

import com.eshop.Eshop.model.Order;
import com.eshop.Eshop.model.PaymentOrder;
import com.eshop.Eshop.model.dto.responsedto.PaymentIdDetails;

public interface OrderService {

    Order placeOrder();
    PaymentIdDetails getPaymentOrderId(Long orderId);
}
