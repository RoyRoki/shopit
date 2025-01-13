package com.eshop.Eshop.controller;

import com.eshop.Eshop.model.Cart;
import com.eshop.Eshop.model.Order;
import com.eshop.Eshop.model.dto.CartItemDTO;
import com.eshop.Eshop.model.dto.CartSummaryDTO;
import com.eshop.Eshop.model.dto.ProductDTO;
import com.eshop.Eshop.model.dto.ViewCartDTO;
import com.eshop.Eshop.model.dto.requestdto.UserDetailsUpdateRequestDTO;
import com.eshop.Eshop.model.dto.responsedto.UserDTO;
import com.eshop.Eshop.service.UserServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserServiceImp userService;

    @GetMapping(value = "/get-user")
    public ResponseEntity<?> getUserDto() {
        try {
            UserDTO userDTO = userService.fetchUserDto();
            return ResponseEntity.ok(userDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Failed to fetch user data.");
        }
    }

    @PutMapping(value = "/update-cart")
    public ResponseEntity<?> incrementQuantityInCart(@RequestBody Map<Long, Integer> idQuantityMap) {
        try {
            ViewCartDTO cart = userService.changeQuantityInCart(idQuantityMap);
            return ResponseEntity.status(HttpStatus.OK).body(cart);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update or add product to cart");
        }
    }

    @DeleteMapping(value = "/update-cart")
    public ResponseEntity<?> decrementQuantityInCart(@RequestBody List<Long> productIds) {
        try {
            ViewCartDTO cart = userService.deleteProductInCart(productIds);
            return ResponseEntity.status(HttpStatus.OK).body(cart);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to delete product to cart");
        }
    }

    @PutMapping(value = "/update-user")
    public ResponseEntity<?> updateUserDetails(@RequestBody UserDetailsUpdateRequestDTO requestDTO) {
        try {
            UserDTO userDTO = userService.updateUser(requestDTO);
            return ResponseEntity.status(HttpStatus.OK).body(userDTO);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error during update user details");
        }
    }

    @GetMapping(value = "/view-cart")
    public ResponseEntity<?> viewCart() {
        try {
            ViewCartDTO cart = userService.getCartItems();
            return ResponseEntity.status(HttpStatus.OK).body(cart);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error during fetching the cart data");
        }
    }

    @GetMapping(value = "/cart-summary")
    public ResponseEntity<?> getCartSummary() {
        try {
            CartSummaryDTO cartSummary = userService.getCartSummary();
            return ResponseEntity.status(HttpStatus.OK).body(cartSummary);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error during fetching cart summary");
        }
    }

    @GetMapping(value = "/orders")
    public ResponseEntity<?> getUserOrders() {
        try {
            List<Order> orders = userService.getOrders();
            return ResponseEntity.status(HttpStatus.OK).body(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error during fetching orders for user");
        }
    }

    @DeleteMapping(value = "/{orderId}/terminate")
    public ResponseEntity<?> terminatePendingOrder(@PathVariable Long orderId) {
        try {
            userService.removePendingOrder(orderId);
            return  ResponseEntity.ok("Order successfully Terminated!");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Termination Failed! "+e.getMessage());
        }
    }

}
