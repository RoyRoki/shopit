package com.eshop.Eshop.controller;

import com.eshop.Eshop.model.Cart;
import com.eshop.Eshop.model.Order;
import com.eshop.Eshop.model.dto.CartItemDTO;
import com.eshop.Eshop.model.dto.CartSummaryDTO;
import com.eshop.Eshop.model.dto.ProductDTO;
import com.eshop.Eshop.model.dto.ViewCartDTO;
import com.eshop.Eshop.model.dto.requestdto.UserAddressDTO;
import com.eshop.Eshop.model.dto.requestdto.UserDetailsUpdateRequestDTO;
import com.eshop.Eshop.model.dto.responsedto.UpdateResponse;
import com.eshop.Eshop.model.dto.responsedto.UserDTO;
import com.eshop.Eshop.service.UserServiceImp;
import com.eshop.Eshop.util.OtpService;
import com.shippo.model.Address;
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

    @Autowired
    private OtpService otpService;

    @GetMapping(value = "/get-user")
    public ResponseEntity<?> getUserDto() {
        try {
            UserDTO userDTO = userService.fetchUserDto();
            return ResponseEntity.ok(userDTO);
        } catch (RuntimeException e) {
            e.printStackTrace();
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

    @PutMapping(value = "/update-user-name")
    public ResponseEntity<UpdateResponse<String>> updateUserName(@RequestParam String name) {
        try {
            userService.updateUserName(name);
            return ResponseEntity.status(HttpStatus.OK).body(
                    UpdateResponse.<String>builder()
                            .message("User name updated successfully")
                            .updatedField("name")
                            .updatedValue(name)
                            .build()
            );
        } catch (Exception e) {
            System.err.println("Error during updating user name : "+e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    UpdateResponse.<String>builder()
                            .message("Failed to update user name")
                            .updatedField("name")
                            .updatedValue(name)
                            .build()
            );
        }
    }

    @PostMapping(value = "/request-update")
    public ResponseEntity<?> requestForUpdate(@RequestParam(required = false) String mobile,
                                              @RequestParam(required = false) String email) {

        if(email == null && mobile == null) return ResponseEntity.badRequest().body("At least one parameter (mobile or email) is required.");
        if(userService.isUserExist(email, mobile)) return ResponseEntity.status(HttpStatus.CONFLICT).body("Email/mobile already Exist. Cant send otp");
        try {
            if(mobile != null && !mobile.isEmpty()) {
                String otp = otpService.generateOTP();
                String hashOtp = otpService.hashMe(otp);

                otpService.sentOtpToMobile(mobile, otp);
                otpService.saveOTP(mobile, hashOtp);

            } else if (email != null && !email.isEmpty()) {
                String otp = otpService.generateOTP();
                String hashOtp = otpService.hashMe(otp);

                otpService.sentOtpToEmail(email, otp);
                otpService.saveOTP(email, hashOtp);
            }
            return ResponseEntity.ok("Otp send to email/mobile");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to generate otp : "+e.getMessage());
        }
    }

    @PutMapping(value = "/update-user-email")
    public ResponseEntity<UpdateResponse<String>> updateEmail(@RequestParam String email, @RequestParam String otp) {
        try {
            String givenOtpHash = otpService.hashMe(otp);
            String savedOtpHash = otpService.getOTP(email);

            if(givenOtpHash.equals(savedOtpHash)) {
                // Clear otp cache
                otpService.deleteOTP(email);

                // Update email
                if(userService.updateUserEmail(email)) {
                    return  ResponseEntity.ok(
                            UpdateResponse.<String>builder()
                                    .message("Email is updated successfully")
                                    .updatedField("email")
                                    .updatedValue(email)
                                    .build()
                    );
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                            UpdateResponse.<String>builder()
                                    .message("Failed to update email")
                                    .updatedField("email")
                                    .updatedValue(email)
                                    .build()
                    );
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                        UpdateResponse.<String>builder()
                                .message("OTP din not match. Failed to update email")
                                .updatedField("email")
                                .updatedValue(email)
                                .build()
                );
            }
        } catch (Exception e) {
            // Log the exception
            System.err.println("Error during email update: "+e.getMessage());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    UpdateResponse.<String>builder()
                            .message("Error during email update")
                            .updatedField("email")
                            .updatedValue(email)
                            .build()
            );
        }
    }

    @PutMapping(value = "/update-user-mobile")
    public ResponseEntity<UpdateResponse<String>> updateMobileNo(@RequestParam String mobile, @RequestParam String otp) {
        try {
            String givenOtpHash = otpService.hashMe(otp);
            String savedOtpHash = otpService.getOTP(mobile);

            if(givenOtpHash.equals(savedOtpHash)) {
                // Clear otp cache
                otpService.deleteOTP(mobile);

                // Update email
                if(userService.updateUserMobileNo(mobile)) {
                    return  ResponseEntity.ok(
                            UpdateResponse.<String>builder()
                                    .message("Mobile is updated successfully")
                                    .updatedField("mobileNo")
                                    .updatedValue(mobile)
                                    .build()
                    );
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                            UpdateResponse.<String>builder()
                                    .message("Failed to update mobile no")
                                    .updatedField("mobileNo")
                                    .updatedValue(mobile)
                                    .build()
                    );
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                        UpdateResponse.<String>builder()
                                .message("OTP din not match. Failed to update mobile")
                                .updatedField("mobileNo")
                                .updatedValue(mobile)
                                .build()
                );
            }
        } catch (Exception e) {
            // Log the exception
            System.err.println("Error during mobile update: "+e.getMessage());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    UpdateResponse.<String>builder()
                            .message("Error during mobile update")
                            .updatedField("mobileNo")
                            .updatedValue(mobile)
                            .build()
            );
        }
    }

    @PostMapping(value = "/add-new-address")
    public ResponseEntity<?> addNewAddress(@RequestBody UserAddressDTO addressDTO) {
        try {
            userService.addNewAddress(addressDTO);
            return ResponseEntity.ok("New Address Successfully added");
        } catch (RuntimeException e) {
            System.err.println("Error during adding new address : "+e.getMessage());
            return ResponseEntity.badRequest().body("Failed to add new address");
        }
    }

    @PutMapping(value = "/update-address")
    public ResponseEntity<UpdateResponse<UserAddressDTO>> updateUserAddress(@RequestParam Long id,
                                                                    @RequestBody UserAddressDTO addressDTO) {
        try {
            userService.updateUserAddress(id, addressDTO);
            return ResponseEntity.ok().body(
                    UpdateResponse.<UserAddressDTO>builder()
                            .message("Updated successfully address")
                            .updatedField("Address")
                            .updatedValue(addressDTO)
                            .build()
            );
        } catch (Exception e) {
            System.err.println("Error during updating address : "+e.getMessage());
            return ResponseEntity.badRequest().body(
                    UpdateResponse.<UserAddressDTO>builder()
                            .message("Error during update address")
                            .updatedField("Address")
                            .updatedValue(addressDTO)
                            .build()
            );
        }
    }

    @PutMapping("/set-default-address")
    public ResponseEntity<?> setDefaultAddress(@RequestParam Long addressId) {
        try {
            userService.setDefaultAddress(addressId);
            return ResponseEntity.ok("Your address set as default");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to set as default");
        }
    }

    @DeleteMapping(value = "/delete-address")
    public ResponseEntity<?> deleteAddress(@RequestParam Long id) {
        try {
            userService.deleteAddress(id);
            return ResponseEntity.ok().body("Delete successful!");
        } catch (Exception e) {
            System.err.println("Error during deleting address : "+e.getMessage());
            return ResponseEntity.badRequest().body("Error during deleting address");
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
