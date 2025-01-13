package com.eshop.Eshop.service;

import com.eshop.Eshop.model.User;
import com.eshop.Eshop.repository.OrderPerStoreRepo;
import com.eshop.Eshop.repository.ProductRepo;
import com.eshop.Eshop.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DevService {
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private OrderPerStoreRepo orderPSRepo;

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public Object getAllProducts() {
        return productRepo.findAll();
    }

    public Object getAllOrderPerStore() {
        return orderPSRepo.findAll();
    }
}
