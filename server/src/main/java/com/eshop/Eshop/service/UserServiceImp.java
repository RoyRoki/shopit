package com.eshop.Eshop.service;

import com.eshop.Eshop.exception.custom.AuthenticationException;
import com.eshop.Eshop.model.*;
import com.eshop.Eshop.model.dto.*;
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

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserServiceImp implements UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private AuthenticationContextService authContextService;

    @Autowired
    private DTOService dtoService;

    @Lazy
    @Autowired
    private CartServiceImp cartService;

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private MessageServiceImp messageService;

    @Autowired
    @Lazy
    private AuthServiceHelper authServiceHelper;

    /**
     * + " encoded" for saved hash password
     */
    @Override
    public UserSignUpResponseDTO addNewUser(UserSignUpRequestDTO requestDTO) {
        List<Role> roles = new ArrayList<>();
        roleRepo.findByRoleName("USER").ifPresent(roles::add);

        User newUser = User.builder()
                    .userName(requestDTO.getUserName())
                    .password(requestDTO.getPassword() + " encoded") //@Fix
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
                .orElseThrow(() -> new RuntimeException("UserService-updateUser-userRepo-findById-error"));
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

            if(requestDTO.getUserName() != null) {
                user.setUserName(requestDTO.getUserName());
            }
            if(requestDTO.getEmail() != null) {
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
        try {
            User user = currentUser();
            Cart cart = user.getCart();

            //Handle Null or Empty Cart
            if (cart == null || cart.getCartItems() == null) {
                return null;
            }

            return dtoService.cartToViewCartDTO(cart);

        } catch (NoSuchElementException e) {
            throw new RuntimeException("User not found");

        } catch (Exception e) {
            throw new RuntimeException("Error during getCartItems in UserServiceImp-error");
        }
    }

    @Override
    public CartSummaryDTO getCartSummary() {
        try {
            User user = currentUser();
            Cart cart = user.getCart();

            //Handle Null or Empty Cart
            if (cart == null || cart.getCartItems() == null) {
                return new CartSummaryDTO();
            }

            List<OrderSummaryPerStoreDTO> orderSummaryPerStores = cartService.getOrderSummaryPerStoreDTO(cart, user);
            return  dtoService.OrderPerStoreToCartSummary(orderSummaryPerStores, cart);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<OrderDTO> getOrders() {
        try {
            User user =  currentUser();
            List<Order> orders =  orderRepo.findAllByUser(user);
            return orders.stream().map(order -> dtoService.orderToOrderDto(order)).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error to fetch orders"+e);
        }
    }

    @Override
    public void removePendingOrder(Long orderId) {
        try {
            User user = currentUser();
            Order order = orderRepo.findById(orderId)
                            .orElseThrow(() -> new RuntimeException("Try to fetch invalid order for id "+orderId));

            if(!order.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("You don't have permission to modify the order state");
            }
            if(!order.getOrderStatus().equals(OrderStatus.PENDING)){
                throw new RuntimeException("Terminate target order is not in pending order");
            }

            // Delete from database
            orderRepo.delete(order);

        } catch (Exception e) {
            throw new RuntimeException("Error during delete or terminate pending order in userServiceImp-removePendingOrder-error"+e.getMessage());
        }
    }

    @Override
    public void handleConfirmedOrder(Order order) {
        messageService.sentMessageToMobile(order.getUser().getMobileNo(), "Hey "+order.getUser().getUserName()+"\nOrder Confirmed id: "+order.getId()+"\n Total cost: "+order.getGrandPrice());
    }

    @Override
    public UserDTO fetchUserDto() {
        try {
            return dtoService.UserToUserDTO(currentUser());
        } catch (RuntimeException e) {
            throw new RuntimeException("Error form userService-fetchUser "+e.getMessage());
        }
    }

    @Override
    public ViewCartDTO changeQuantityInCart(Map<Long, Integer> idQuantityMap) {
        try {
            Long userId = authContextService.getAuthenticatedUserId();
            User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("user not found at updateProductToCart"));

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
                    cartService.updateOrRemoveItem(cartItems, id, (cartItem.getQuantity() + idQuantityMap.getOrDefault(id, 0)));
                }
            });

            // Add new product to cart
            for(Map.Entry<Long, Integer> entry : idQuantityMap.entrySet()) {
                boolean isExist = cartItems.stream().anyMatch(cartItem -> Objects.equals(cartItem.getProduct().getId(), entry.getKey()));
                // If not exist
                if(!isExist) {
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

        } catch (RuntimeException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public ViewCartDTO deleteProductInCart(List<Long> productIds) {
        try {
            Long userId = authContextService.getAuthenticatedUserId();
            User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("user not found at updateProductToCart"));

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
            for(Long id : productIds) {
                cartItems.removeIf(cartItem -> cartItem.getProduct().getId().equals(id));
            }

            // set updated cartItems
            cart.setCartItems(cartItems);

            // set Total price
            cart.setTotalCartPrice(cartService.calTotalCartPrice(cart.getCartItems()));

            // save and return the cart
            Cart savedCart = cartRepo.save(cart);

            return dtoService.cartToViewCartDTO(savedCart);

        } catch (RuntimeException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public boolean updateUserEmail(String email) {
        try {
            User user = currentUser();
            user.setEmail(email);
            userRepo.save(user);
            return true;
        } catch (RuntimeException e) {
            System.err.println("Error updating user email: " + e.getMessage());
            return false;
        }
    }

    @Override
    public boolean updateUserMobileNo(String mobile) {
        try {
            User user = currentUser();
            user.setMobileNo(mobile);
            userRepo.save(user);
            return true;
        } catch (RuntimeException e) {
            System.err.println("Error updating user mobile: " + e.getMessage());
            return false;
        }
    }

    @Override
    public void updateUserName(String name) {
        try {
            User user = currentUser();
            user.setUserName(name);
            userRepo.save(user);
        } catch (RuntimeException e) {
            throw new RuntimeException("Error during updating user name"+e.getMessage());
        }
    }

    @Override
    public void addNewAddress(UserAddressDTO addressDTO) {
        try {
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
        } catch (Exception e) {
            throw new RuntimeException("Error during save new address : "+e.getMessage());
        }
    }

    @Override
    public void updateUserAddress(Long id, UserAddressDTO addressDTO) {
        try {
            User user = currentUser();
            Address address = user.getAddresses().stream()
                    .filter((ads -> ads.getId().equals(id)))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Address with ID " + id + " not found"));

            // Update address fields
            address.setLandmark(addressDTO.getLandmark());
            address.setCity(addressDTO.getCity());
            address.setState(addressDTO.getState());
            address.setStreet(addressDTO.getStreet());
            address.setPinCode(addressDTO.getPinCode());
            address.setHouseNo(addressDTO.getHouseNo());

            // If it is default address
            if(addressDTO.isDefault()) {
                user.setDefaultAddressId(address.getId());
            }
            // Save the updated user
            userRepo.save(user);

        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public void deleteAddress(Long id) {
        try {
            User user = currentUser();

            Address addressToDelete = user.getAddresses().stream()
                    .filter((ads -> ads.getId().equals(id)))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Address with ID " + id + " not found"));

            // Remove the address
            user.getAddresses().remove(addressToDelete);
            // Save the updated user
            userRepo.save(user);

        } catch (Exception e) {
            throw new RuntimeException("Error during deleting user address : "+e.getMessage());
        }
    }

    @Override
    public void setDefaultAddress(Long addressId) {
        try {
            User user = currentUser();
            if(user.getAddresses().stream().anyMatch(address -> address.getId().equals(addressId))) {
                user.setDefaultAddressId(addressId);
                userRepo.save(user);
            } else {
                throw new RuntimeException("Wrong address id to set as default.");
            }
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public boolean isUserExist(String email, String mobileNo) {
        if(email != null) return userRepo.existsByEmail(email);
        else if(mobileNo != null) return userRepo.existsByMobileNo(mobileNo);
        else return true;
    }

    @Override
    public void handleShipped(Order order) {
        messageService.sentMessageToMobile(order.getUser().getMobileNo(), "Hey "+order.getUser().getUserName()+"\nOrder Shipped id: "+order.getId()+"\n Total cost: "+order.getGrandPrice()); 
    }

    /**
     * Updates the current user's password after verifying the old password.
     * + " encoded" for saved hash password
     * @param passwordDTO Contains the old and new passwords.
     * @throws AuthenticationException If the old password is incorrect.
     */
    @Override
    public void handleUpdatePassword(UpdatePasswordDTO passwordDTO) {
        // Get the currently authenticated user
        User user = currentUser();
        String savedHashPass = user.getPassword().replace(" encoded", "");
        
        // Verify if the old password matches
        if(!authServiceHelper.matchRawAndEncoded(passwordDTO.getOldPassword(), savedHashPass)) {
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
    
}
