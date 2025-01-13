package com.eshop.Eshop.service;

import com.eshop.Eshop.model.CartItem;
import com.eshop.Eshop.model.Store;
import com.shippo.Shippo;
import com.shippo.exception.APIConnectionException;
import com.shippo.exception.APIException;
import com.shippo.exception.AuthenticationException;
import com.shippo.exception.InvalidRequestException;
import com.shippo.model.Address;
import com.shippo.model.Shipment;
import com.shippo.model.Transaction;
import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
public class DeliveryPartnerService {

    @Value("${delivery-partner.shippo.client-id}")
    private String clientId;

    public String testDeliveryPartner() {
        OkHttpClient client = new OkHttpClient();

        FormBody formBody = new FormBody.Builder()
                .add("name", "Shawn Ippotle")
                .add("company", "Shippo")
                .add("street1", "215 Clayton St.")
                .add("street2", "")
                .add("city", "San Francisco")
                .add("state", "CA")
                .add("zip", "94117")
                .add("country", "US")
                .add("phone", "+1 555 341 9393")
                .add("email", "shippotle@shippo.com")
                .add("is_residential", "True") // Shippo API expects "True" as a string
                .add("metadata", "Customer ID 123456")
                .build();

        Request request = new Request.Builder()
                .url("https://api.goshippo.com/addresses/")
                .addHeader("Authorization", "ShippoToken " + clientId)
                .post(formBody)
                .build();

        // Execute the request
        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful() && response.body() != null) {
                // Successful response
                return response.body().string();
            } else {
                // Handle failure
                return "Request failed: " + response.code();
            }

        } catch (Exception e) {
            return "Error: ";
        }
    }

    public Object createShipmentObject() throws APIConnectionException, APIException, AuthenticationException, InvalidRequestException {

       try {
           Shippo.setApiKey(clientId);
           HashMap<String, Object> addressMap = new HashMap<String, Object>();
           addressMap.put("name", "Roki");
           addressMap.put("company", "eshop");
           addressMap.put("street1", "215 Clayton St.");
           addressMap.put("city", "San Francisco");
           addressMap.put("state", "CA");
           addressMap.put("zip", "94117");
           addressMap.put("country", "US");
           addressMap.put("phone", "+1 555 341 9393");
           addressMap.put("email", "support@goshipppo.com");

           Address createAddress = Address.create(addressMap);

           return createAddress;
       } catch (Exception e) {
           throw new RuntimeException(e);
       }

    }

    public double calculateDeliveryCost(com.eshop.Eshop.model.Address from, com.eshop.Eshop.model.Address to, List<CartItem> cartItems) {
        return 80.0;
    }

//    @Value("${delivery-partner.fedex.client-secret}")
//    private String clientSecret;
//
//    @Autowired
//    private RedisService redis;
//
//    public void generateAccessToken() {
//
//        OkHttpClient client = new OkHttpClient();
//        FormBody body = new FormBody.Builder()
//                .add("grant_type", "client_credentials")
//                .add("client_id", clientId)
//                .add("client_secret", clientSecret)
//                .build();
//
//        Request request = new Request.Builder()
//                .url("https://apis-sandbox.fedex.com/oauth/token")
//                .post(body)
//                .addHeader("Content-Type", "application/x-www-form-urlencoded")
//                .build();
//
//        try(Response response = client.newCall(request).execute()) {
//            if(response.isSuccessful() && response.body() != null) {
//                ObjectMapper mapper = new ObjectMapper();
//                JsonNode jsonResponse = mapper.readTree(response.body().string());
//
//                String accessToken = jsonResponse.get("access_token").asText();
//                long expiresIn = jsonResponse.get("expires_in").asLong();
//
//                System.out.println("FedEx AccessToken Generated: "+accessToken);
//                // Store token in Redis with TTL
//                redis.put("fedex:access_token", accessToken, expiresIn);
//
//            } else {
//                throw new RuntimeException("Failed to fetch fedex accessToken : "+response.message());
//            }
//
//        } catch (Exception e) {
//            throw new RuntimeException("Error Fetching FedEx Access Token Service-helper-FedExService-generateAccessToken-error");
//        }
//    }
//
//    public String getAccessToken() {
//        try {
//            String accessToken = redis.get("fedex:access_token");
//            if(accessToken == null) {
//                generateAccessToken();
//                accessToken = redis.get("fedex:access_token");
//            }
//            return accessToken;
//
//        } catch (Exception e) {
//            throw new RuntimeException("Error during getAccessToken of FedEx:");
//        }
//    }

}
