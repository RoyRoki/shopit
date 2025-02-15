package com.eshop.Eshop.service;

import com.eshop.Eshop.exception.custom.AuthenticationException;
import com.eshop.Eshop.exception.custom.DatabaseOperationException;
import com.eshop.Eshop.exception.custom.InvalidInputException;
import com.eshop.Eshop.exception.custom.InvalidOTPException;
import com.eshop.Eshop.exception.custom.ResourceNotFoundException;
import com.eshop.Eshop.exception.custom.UnprocessableEntityException;
import com.eshop.Eshop.exception.custom.UserAlreadyExistsException;
import com.eshop.Eshop.model.*;
import com.eshop.Eshop.model.dto.*;
import com.eshop.Eshop.model.dto.requestdto.MobileOrEmailRequestDTO;
import com.eshop.Eshop.model.dto.requestdto.OTPVerifyRequestDTO;
import com.eshop.Eshop.model.dto.requestdto.UpdatePasswordDTO;
import com.eshop.Eshop.model.dto.requestdto.UserAddressDTO;
import com.eshop.Eshop.model.dto.requestdto.UserDetailsUpdateRequestDTO;
import com.eshop.Eshop.model.dto.requestdto.UserSignUpRequestDTO;
import com.eshop.Eshop.model.dto.responsedto.OrderDTO;
import com.eshop.Eshop.model.dto.responsedto.OrderSummaryPerStoreDTO;
import com.eshop.Eshop.model.dto.responsedto.UserDTO;
import com.eshop.Eshop.model.dto.responsedto.UserSignUpResponseDTO;
import com.eshop.Eshop.model.enums.OrderStatus;
import com.eshop.Eshop.repository.*;
import com.eshop.Eshop.service.Interface.UserService;
import com.eshop.Eshop.service.helper.AuthServiceHelper;
import com.eshop.Eshop.util.AuthenticationContextService;
import com.eshop.Eshop.util.OtpService;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserServiceImp implements UserService {

    private final UserRepo userRepo;
    private final RoleRepo roleRepo;
    private final CartRepo cartRepo;
    private final AuthenticationContextService authContextService;
    private final DTOService dtoService;
    private final CartServiceImp cartService;
    private final OrderRepo orderRepo;
    private final MessageServiceImp messageService;
    private final AuthServiceHelper authServiceHelper;
    private final OtpService otpService;

    public UserServiceImp(
            UserRepo userRepo,
            RoleRepo roleRepo,
            CartRepo cartRepo,
            AuthenticationContextService authContextService,
            DTOService dtoService,
            @Lazy CartServiceImp cartService,
            OrderRepo orderRepo,
            OtpService otpService,
            MessageServiceImp messageService,
            @Lazy AuthServiceHelper authServiceHelper) {

        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.cartRepo = cartRepo;
        this.otpService = otpService;
        this.authContextService = authContextService;
        this.dtoService = dtoService;
        this.cartService = cartService;
        this.orderRepo = orderRepo;
        this.messageService = messageService;
        this.authServiceHelper = authServiceHelper;
    }

    /**
     * + " encoded" for saved hash password
     */
    @Override
    public UserSignUpResponseDTO addNewUser(UserSignUpRequestDTO requestDTO) {
        List<Role> roles = new ArrayList<>();
        roleRepo.findByRoleName("USER").ifPresent(roles::add);

        User newUser = User.builder()
                .userName(requestDTO.getUserName())
                .password(requestDTO.getPassword() + " encoded") // @Fix
                .mobileNo(requestDTO.getMobileNo())
                .roles(roles)
                .createAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User savedUser = userRepo.save(newUser);

        return UserSignUpResponseDTO.builder()
                .userName(requestDTO.getUserName())
                .mobileNo(requestDTO.getMobileNo())
                .userId(Long.toString(savedUser.getId()))
                .build();

    }

    @Override
    public User getUserById(Long id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User with ID " + id + " not found"));
    }

    @Override
    public User currentUser() {
        return getUserById(authContextService.getAuthenticatedUserId());
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(email + " not found"));
    }

    @Override
    public User getUserByMobileNo(String mobileNo) {
        return userRepo.findByMobileNo(mobileNo)
                .orElseThrow(() -> new RuntimeException(mobileNo + "  not found"));
    }

    @Override
    public UserDTO updateUser(UserDetailsUpdateRequestDTO requestDTO) {
        try {
            User user = currentUser();

            if (requestDTO.getUserName() != null) {
                user.setUserName(requestDTO.getUserName());
            }
            if (requestDTO.getEmail() != null) {
                user.setEmail(requestDTO.getEmail());
            }

            user.setUpdatedAt(LocalDateTime.now());

            User updatedUser = userRepo.save(user);
            return dtoService.UserToUserDTO(updatedUser);

        } catch (Exception e) {
            throw new RuntimeException("Error during update user at userServiceImp-updateUser");
        }
    }

    @Override
    public ViewCartDTO getCartItems() {

        User user = currentUser();
        Cart cart = user.getCart();

        // Handle Null or Empty Cart
        if (cart == null || cart.getCartItems() == null) {
            return null;
        }
        return dtoService.cartToViewCartDTO(cart);
    }

    @Override
    public CartSummaryDTO getCartSummary() {

        User user = currentUser();
        Cart cart = user.getCart();

        // Throw an exception if the user has no saved addresses
        if (user.getAddresses().isEmpty()) {
            throw new UnprocessableEntityException("User must have at least one saved address.");
        }

        // Handle Null or Empty Cart
        if (cart == null || cart.getCartItems() == null) {
            return new CartSummaryDTO();
        }

        List<OrderSummaryPerStoreDTO> orderSummaryPerStores = cartService.getOrderSummaryPerStoreDTO(cart, user);
        return dtoService.OrderPerStoreToCartSummary(orderSummaryPerStores, cart);
    }

    @Override
    public List<OrderDTO> getOrders() {

        User user = currentUser();
        List<Order> orders = orderRepo.findAllByUser(user)
                .orElseThrow(() -> new DatabaseOperationException("Failed to fetch orders."));

        return orders.stream().map(order -> dtoService.orderToOrderDto(order)).collect(Collectors.toList());
    }

    @Override
    public void removePendingOrder(Long orderId) {

        User user = currentUser();
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new InvalidInputException("Try to fetch invalid order for id " + orderId));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new AuthenticationException("You don't have permission to modify the order state");
        }

        if (!order.getOrderStatus().equals(OrderStatus.PENDING)) {
            throw new UnprocessableEntityException("Terminate target order is not in pending order");
        }

        // Delete from database
        orderRepo.delete(order);
    }

    @Override
    public void handleConfirmedOrder(Order order) {
        messageService.sentMessageToMobile(order.getUser().getMobileNo(), "Hey " + order.getUser().getUserName()
                + "\nOrder Confirmed id: " + order.getId() + "\n Total cost: " + order.getGrandPrice());
    }

    @Override
    public UserDTO fetchUserDto() {
        return dtoService.UserToUserDTO(currentUser());
    }

    @Override
    public ViewCartDTO changeQuantityInCart(Map<Long, Integer> idQuantityMap) {

        User user = currentUser();
        Cart cart = user.getCart();

        // If user doesn't have a cart, create one
        if (cart == null) {
            cart = new Cart();
            user.setCart(cart);
            cart.setUser(user);
        }

        // Retrieve and make cart items mutable
        List<CartItem> cartItems = cart.getCartItems();

        // Update if already have the product
        cartItems.forEach((cartItem) -> {
            if (idQuantityMap.containsKey(cartItem.getProduct().getId())) {
                Long id = cartItem.getProduct().getId();
                // Update
                cartService.updateOrRemoveItem(cartItems, id,
                        (cartItem.getQuantity() + idQuantityMap.getOrDefault(id, 0)));
            }
        });

        // Add new product to cart
        for (Map.Entry<Long, Integer> entry : idQuantityMap.entrySet()) {
            boolean isExist = cartItems.stream()
                    .anyMatch(cartItem -> Objects.equals(cartItem.getProduct().getId(), entry.getKey()));
            // If not exist
            if (!isExist) {
                cartItems.add(cartService.createCartItem(entry.getKey(), entry.getValue(), cart));
            }
        }

        // set updated cartItems
        cart.setCartItems(cartItems);

        // set Total price
        cart.setTotalCartPrice(cartService.calTotalCartPrice(cart.getCartItems()));

        // save and return the cart
        Cart savedCart = cartRepo.save(cart);

        return dtoService.cartToViewCartDTO(savedCart);
    }

    @Override
    public ViewCartDTO deleteProductInCart(List<Long> productIds) {

        User user = currentUser();
        Cart cart = user.getCart();

        // If user doesn't have a cart, create one
        if (cart == null) {
            cart = new Cart();
            user.setCart(cart);
            cart.setUser(user);
        }

        // Retrieve and make cart items mutable
        List<CartItem> cartItems = cart.getCartItems();

        // Delete products in cart
        for (Long id : productIds) {
            cartItems.removeIf(cartItem -> cartItem.getProduct().getId().equals(id));
        }

        // set updated cartItems
        cart.setCartItems(cartItems);

        // set Total price
        cart.setTotalCartPrice(cartService.calTotalCartPrice(cart.getCartItems()));

        // save and return the cart
        Cart savedCart = cartRepo.save(cart);

        return dtoService.cartToViewCartDTO(savedCart);
    }

    @Override
    public boolean updateUserEmail(String email) {

        User user = currentUser();
        user.setEmail(email);
        userRepo.save(user);
        return true;
    }

    @Override
    public boolean updateUserMobileNo(String mobile) {

        User user = currentUser();
        user.setMobileNo(mobile);
        userRepo.save(user);
        return true;
    }

    @Override
    public void updateUserName(String name) {

        // Check the name validation
        if (Objects.isNull(name)) {
            throw new InvalidInputException("Username cannot be null or empty");
        }

        // Save the user
        User user = currentUser();
        user.setUserName(name);
        userRepo.save(user);
    }

    @Override
    public void addNewAddress(UserAddressDTO addressDTO) {

        User user = currentUser();

        Address newAddress = Address.builder()
                .landmark(addressDTO.getLandmark())
                .street(addressDTO.getStreet())
                .state(addressDTO.getState())
                .houseNo(addressDTO.getHouseNo())
                .city(addressDTO.getCity())
                .pinCode(addressDTO.getPinCode())
                .build();

        user.getAddresses().add(newAddress);
        userRepo.save(user);
    }

    @Override
    public void updateUserAddress(Long id, UserAddressDTO addressDTO) {

        User user = currentUser();
        Address address = user.getAddresses().stream()
                .filter((ads -> ads.getId().equals(id)))
                .findFirst()
                .orElseThrow(() -> new InvalidInputException("Address with ID " + id + " not found"));

        // Update address fields
        address.setLandmark(addressDTO.getLandmark());
        address.setCity(addressDTO.getCity());
        address.setState(addressDTO.getState());
        address.setStreet(addressDTO.getStreet());
        address.setPinCode(addressDTO.getPinCode());
        address.setHouseNo(addressDTO.getHouseNo());

        // If it is default address
        if (addressDTO.isDefault()) {
            user.setDefaultAddressId(address.getId());
        }
        // Save the updated user
        userRepo.save(user);
    }

    @Override
    public void deleteAddress(Long id) {

        User user = currentUser();

        Address addressToDelete = user.getAddresses().stream()
                .filter((ads -> ads.getId().equals(id)))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Address with ID " + id + " not found"));

        // Remove the address
        user.getAddresses().remove(addressToDelete);

        // Save the updated user
        userRepo.save(user);
    }

    @Override
    public void setDefaultAddress(Long addressId) {

        User user = currentUser();
        if (user.getAddresses().stream().anyMatch(address -> address.getId().equals(addressId))) {
            user.setDefaultAddressId(addressId);
            userRepo.save(user);
        } else {
            throw new InvalidInputException("Wrong address id to set as default.");
        }
    }

    @Override
    public boolean isUserExist(String email, String mobileNo) {
        if (email != null)
            return userRepo.existsByEmail(email);
        else if (mobileNo != null)
            return userRepo.existsByMobileNo(mobileNo);
        else
            return true;
    }

    @Override
    public void handleShipped(Order order) {
        messageService.sentMessageToMobile(order.getUser().getMobileNo(), "Hey " + order.getUser().getUserName()
                + "\nOrder Shipped id: " + order.getId() + "\n Total cost: " + order.getGrandPrice());
    }

    /**
     * Updates the current user's password after verifying the old password.
     * + " encoded" for saved hash password
     * 
     * @param passwordDTO Contains the old and new passwords.
     * @throws AuthenticationException If the old password is incorrect.
     */
    @Override
    public void handleUpdatePassword(UpdatePasswordDTO passwordDTO) {
        // Get the currently authenticated user
        User user = currentUser();
        String savedHashPass = user.getPassword().replace(" encoded", "");

        // Verify if the old password matches
        if (!authServiceHelper.matchRawAndEncoded(passwordDTO.getOldPassword(), savedHashPass)) {
            throw new AuthenticationException("Old password is incorrect. Please try again.");
        }

        // Encrypt and update the new password
        user.setPassword(authServiceHelper.passwordToHash(passwordDTO.getNewPassword()) + " encoded");
        userRepo.save(user);
    }

    @Override
    public void updateUserPassword(String hashPass, User user) {
        user.setPassword(hashPass);
        userRepo.save(user);
    }

    @Override
    public void handleMobileEmailUpdateRequest(MobileOrEmailRequestDTO request) {

        // Check that new mobile/email is not already exists
        if (isUserExist(request.getEmail(), request.getMobileNo())) {
            throw new UserAlreadyExistsException("User with provided email or mobile number already exists.");
        }

        // If a mobile number is provided, an OTP is sent to the mobile number.
        if (Objects.nonNull(request.getMobileNo())) {
            otpService.saveAndSendOTP(request.getMobileNo(), true);
        }

        // If an email is provided, an OTP is sent to the email.
        else if (Objects.nonNull(request.getEmail())) {
            otpService.saveAndSendOTP(request.getEmail(), false);
        }

    }

    @Override
    public void handleMobileEmailUpdateRequest(OTPVerifyRequestDTO requestDTO) {

        // Get the stored OTP hash based on email or mobile number
        String identifier = requestDTO.getEmail() != null ? requestDTO.getEmail() : requestDTO.getMobileNo();

        String savedHashOtp = otpService.getOTP(identifier);

        // If no OTP is found, throw Authenticaiton exception
        if (Objects.isNull(savedHashOtp)) {
            throw new AuthenticationException("Try To Update Contact Without otp request");
        }

        // Hash the OTP provided by the user
        String requestOtpHash = otpService.hashMe(requestDTO.getOtp());

        // Validate OTP by comparing hashes
        if (!savedHashOtp.equals(requestOtpHash)) {
            throw new InvalidOTPException("Try to update email/mobile with invalied otp");
        }

        // OTP is correct, so remove it from storage
        otpService.deleteOTP(identifier);

        // Get the user
        User user = currentUser();

        // Update the mobile
        if (Objects.nonNull(requestDTO.getMobileNo())) {
            user.setMobileNo(requestDTO.getMobileNo());
        } else if (Objects.nonNull(requestDTO.getEmail())) {
            user.setEmail(requestDTO.getEmail());
        }

        // Update in Database
        userRepo.save(user);
    }

}
