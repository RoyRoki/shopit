package com.eshop.Eshop.controller;

import com.eshop.Eshop.service.DevService;
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

    @GetMapping("/all-products")
    public ResponseEntity<?> getAllProject() {
        return ResponseEntity.status(HttpStatus.OK).body(devService.getAllProducts());
    }

    @GetMapping("/all-orderperstore")
    public ResponseEntity<?> getAllOrderPerStore() {
        return ResponseEntity.status(HttpStatus.OK).body(devService.getAllOrderPerStore());
    }

}