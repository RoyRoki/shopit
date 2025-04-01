package com.eshop.Eshop.controller;

import com.eshop.Eshop.model.dto.CartSummaryDTO;
import com.eshop.Eshop.model.dto.ViewCartDTO;
import com.eshop.Eshop.model.dto.requestdto.MobileOrEmailRequestDTO;
import com.eshop.Eshop.model.dto.requestdto.OTPVerifyRequestDTO;
import com.eshop.Eshop.model.dto.requestdto.UpdatePasswordDTO;
import com.eshop.Eshop.model.dto.requestdto.UserAddressDTO;
import com.eshop.Eshop.model.dto.requestdto.UserDetailsUpdateRequestDTO;
import com.eshop.Eshop.model.dto.responsedto.OrderDTO;
import com.eshop.Eshop.model.dto.responsedto.UserDTO;
import com.eshop.Eshop.service.UserServiceImp;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserServiceImp userService;

    public UserController(UserServiceImp userService) {
        this.userService = userService;
    }

    /**
     * Retrieves the user details.
     *
     * @return ResponseEntity containing the user details as a {@link UserDTO}.
     */
    @GetMapping(value = "/get-user")
    public ResponseEntity<UserDTO> getUserDto() {

        UserDTO userDTO = userService.fetchUserDto();
        return ResponseEntity.ok(userDTO);
    }

    /**
     * Updates the quantity of products in the cart.
     *
     * @param idQuantityMap A map containing product IDs as keys and their updated quantities as values.
     * @return ResponseEntity containing the updated cart details as a {@link ViewCartDTO}.
     */
    @PutMapping(value = "/update-cart")
    public ResponseEntity<ViewCartDTO> incrementQuantityInCart(@RequestBody Map<Long, Integer> idQuantityMap) {

        ViewCartDTO cart = userService.changeQuantityInCart(idQuantityMap);
        return ResponseEntity.status(HttpStatus.OK).body(cart);
    }

    /**
     * Removes products from the cart.
     *
     * @param productIds A list of product IDs to be removed from the cart.
     * @return ResponseEntity containing the updated cart details as a {@link ViewCartDTO}.
     */
    @DeleteMapping(value = "/update-cart")
    public ResponseEntity<ViewCartDTO> decrementQuantityInCart(@RequestBody List<Long> productIds) {

        ViewCartDTO cart = userService.deleteProductInCart(productIds);
        return ResponseEntity.status(HttpStatus.OK).body(cart);
    }

    /**
     * Updates the user's name.
     *
     * @param requestDTO The request body containing the new user name in a {@link UserDetailsUpdateRequestDTO}.
     * @return ResponseEntity containing the update confirmation in String.
     */
    @PutMapping(value = "/update-user-name")
    public ResponseEntity<String> updateUserName(@Valid @RequestBody UserDetailsUpdateRequestDTO requestDTO) {

        userService.updateUserName(requestDTO.getUserName());
        return ResponseEntity.ok("User name updated successfully");
    }

    /**
     * Endpoint to request an update for the user's mobile number or email.
     * Sends an OTP to the provided mobile number or email for verification.
     *
     * @param requestDTO The request body containing the mobile number or email.
     * @return ResponseEntity with a success message if OTP is sent.
     */
    @PostMapping(value = "/request-update")
    public ResponseEntity<String> requestForUpdate(@Valid @RequestBody MobileOrEmailRequestDTO requestDTO) {

        userService.handleMobileEmailUpdateRequest(requestDTO);
        return ResponseEntity.ok("Otp send to email/mobile");
    }

    /**
     * Updates the user's email or mobile number after OTP verification.
     *
     * @param request The request containing the contact info and OTP.
     * @return Response with a success message.
     */
    @PutMapping(value = "/update-user-contact")
    public ResponseEntity<String> updateEmail(@Valid @RequestBody OTPVerifyRequestDTO request) {

        userService.handleMobileEmailUpdateRequest(request);
        return ResponseEntity.ok("User Contact Update Successfully");
    }

    /**
     * Adds a new address for the user.
     *
     * @param addressDTO The address details to be added. Must be valid.
     * @return A success message if the address is added successfully.
     */
    @PostMapping(value = "/add-new-address")
    public ResponseEntity<String> addNewAddress(@Valid @RequestBody UserAddressDTO addressDTO) {

        userService.addNewAddress(addressDTO);
        return ResponseEntity.ok("New Address Successfully added");
    }

    /**
     * Updates the user's address based on the provided ID.
     *
     * @param id         The ID of the address to be updated.
     * @param addressDTO The new address details. Must be valid.
     * @return ResponseEntity with a success message if the address is updated.
     */
    @PutMapping(value = "/update-address")
    public ResponseEntity<String> updateUserAddress(@RequestParam Long id,
            @Valid @RequestBody UserAddressDTO addressDTO) {

        userService.updateUserAddress(id, addressDTO);
        return ResponseEntity.ok().body("Address is updated successfully");
    }

    /**
     * Sets a specific address as the default address for the user.
     *
     * @param addressId The ID of the address to be set as default.
     * @return ResponseEntity with a success message if the address is successfully set as default.
     */
    @PutMapping("/set-default-address")
    public ResponseEntity<String> setDefaultAddress(@RequestParam Long addressId) {

        userService.setDefaultAddress(addressId);
        return ResponseEntity.ok("Your address set as default");
    }

    /**
     * Deletes a user’s address based on the provided ID.
     *
     * @param id The ID of the address to be deleted.
     * @return ResponseEntity with a success message if the address is deleted successfully.
     */
    @DeleteMapping(value = "/delete-address")
    public ResponseEntity<String> deleteAddress(@RequestParam Long id) {

            userService.deleteAddress(id);
            return ResponseEntity.ok().body("Address Deleted successful!");
    }

    /**
     * Retrieves the current items in the user's cart.
     *
     * @return ResponseEntity containing the ViewCartDTO with cart items.
     */
    @GetMapping(value = "/view-cart")
    public ResponseEntity<ViewCartDTO> viewCart() {

        ViewCartDTO cart = userService.getCartItems();
        return ResponseEntity.status(HttpStatus.OK).body(cart);
    }

    /**
     * Updates the user's address based on the provided ID.
     *
     * @param id         The ID of the address to be updated.
     * @param addressDTO The new address details. Must be valid.
     * @return ResponseEntity with a success message if the address is updated.
     * @throws UnprocessableEntityException if the user does not have an address.(@code 422 Unprocessable Entity)
     */
    @GetMapping(value = "/cart-summary")
    public ResponseEntity<CartSummaryDTO> getCartSummary() {

        CartSummaryDTO cartSummary = userService.getCartSummary();
        return ResponseEntity.status(HttpStatus.OK).body(cartSummary);
    }

    /**
     * Retrieves the list of orders placed by the user.
     *
     * @return ResponseEntity containing a list of OrderDTOs representing user orders.
     */
    @GetMapping(value = "/orders")
    public ResponseEntity<List<OrderDTO>> getUserOrders() {

        List<OrderDTO> orders = userService.getOrders();
        return ResponseEntity.status(HttpStatus.OK).body(orders);
    }

    /**
     * Terminates a pending order.
     *
     * @param orderId The ID of the order to be terminated.
     * @return ResponseEntity with a success message if the order is successfully terminated.
     * @throws InvalidInputException If the order ID is invalid.
     * @throws AuthenticationException If the user does not have permission to modify the order.
     * @throws UnprocessableEntityException If the order is not in a pending state.
     */
    @DeleteMapping(value = "/{orderId}/terminate")
    public ResponseEntity<?> terminatePendingOrder(@PathVariable Long orderId) {

        userService.removePendingOrder(orderId);
        return ResponseEntity.ok("Order successfully Terminated!");
    }

    /**
     * Updates the user's password using the old password for verification. @Todo =>
     * usercontroler
     *
     * @param passwordDTO Contains old and new passwords.
     * @return Success message if the password is updated.
     */
    @PutMapping(value = "/update-password")
    public ResponseEntity<String> updatePasswordByOldPass(@Valid @RequestBody UpdatePasswordDTO passwordDTO) {
        userService.handleUpdatePassword(passwordDTO);
        return ResponseEntity.ok("Successfully password updated");
    }

}
