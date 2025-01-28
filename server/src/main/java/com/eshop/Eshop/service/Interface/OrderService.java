package com.eshop.Eshop.service.Interface;

import com.eshop.Eshop.model.Order;
import com.eshop.Eshop.model.PaymentOrder;
import com.eshop.Eshop.model.dto.responsedto.PaymentIdDetails;
import com.eshop.Eshop.model.enums.PaymentType;

public interface OrderService {

    Order placeOrder(Long addressId, PaymentType paymentType);
    PaymentIdDetails getPaymentOrderId(Long orderId);
    void cancelOrder(Long orderId, String message);
}
