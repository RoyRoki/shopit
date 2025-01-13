package com.eshop.Eshop.model.dto.responsedto;

import lombok.Builder;
import lombok.Data;
import org.json.JSONObject;

@Data
@Builder
public class PaymentIdDetails {
    private String apiKeyId;
    private String amountInPaise;
    private String currency;
    private String name;
    private String description;
    private String image;
    private String paymentOrderId;
    private JSONObject prefill;
    private JSONObject notes;
    private JSONObject theme;
}
