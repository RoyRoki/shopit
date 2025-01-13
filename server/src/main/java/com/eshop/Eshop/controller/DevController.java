package com.eshop.Eshop.controller;

import com.eshop.Eshop.service.DevService;
import com.eshop.Eshop.service.DeliveryPartnerService;
import com.shippo.exception.APIConnectionException;
import com.shippo.exception.APIException;
import com.shippo.exception.AuthenticationException;
import com.shippo.exception.InvalidRequestException;
import com.shippo.model.Shipment;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/dev")
public class DevController {

    @Autowired
    private DevService devService;

    @Autowired
    private DeliveryPartnerService deliveryPartnerService;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        System.out.println("hit /dev/users");
        try {
            return new ResponseEntity<>(devService.getAllUsers(), HttpStatus.OK);
        } catch (Exception e) {
            HttpHeaders headers = new HttpHeaders();
            headers.set("message", "getAllUsers failed");
            return new ResponseEntity<>("Not found any Users",headers, HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/delivery-partner-test")
    public String getFedExAuthentication() {
        return deliveryPartnerService.testDeliveryPartner();
    }

    @GetMapping("/shipment-test")
    public ResponseEntity<Object> shipmentTest(){
        try {
            return ResponseEntity.status(HttpStatus.OK).body(deliveryPartnerService.createShipmentObject());
        }
         catch (Exception e) {
            return new ResponseEntity<>("Error: ",HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/all-products")
    public ResponseEntity<?> getAllProject() {
        return ResponseEntity.status(HttpStatus.OK).body(devService.getAllProducts());
    }

    @GetMapping("/all-orderperstore")
    public ResponseEntity<?> getAllOrderPerStore() {
        return ResponseEntity.status(HttpStatus.OK).body(devService.getAllOrderPerStore());
    }

}