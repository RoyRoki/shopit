package com.eshop.Eshop.service.Interface;

import com.eshop.Eshop.model.Cart;
import com.eshop.Eshop.model.Order;
import com.eshop.Eshop.model.dto.CartItemDTO;
import com.eshop.Eshop.model.dto.CartSummaryDTO;
import com.eshop.Eshop.model.dto.ViewCartDTO;
import com.eshop.Eshop.model.dto.requestdto.UserAddressDTO;
import com.eshop.Eshop.model.dto.requestdto.UserDetailsUpdateRequestDTO;
import com.eshop.Eshop.model.dto.requestdto.UserSignUpRequestDTO;
import com.eshop.Eshop.model.dto.responsedto.OrderDTO;
import com.eshop.Eshop.model.dto.responsedto.UserDTO;
import com.eshop.Eshop.model.dto.responsedto.UserSignUpResponseDTO;
import com.eshop.Eshop.model.User;

import java.util.List;
import java.util.Map;

public interface UserService {
    UserSignUpResponseDTO addNewUser(UserSignUpRequestDTO userSignUpRequestDTO);
    boolean isUserExist(String email, String mobileNo);
    User getUserById(Long id);
    User currentUser();
    User getUserByEmail(String email);
    User getUserByMobileNo(String mobileNo);
    UserDTO updateUser(UserDetailsUpdateRequestDTO requestDTO);
    ViewCartDTO getCartItems();
    CartSummaryDTO getCartSummary();
    List<OrderDTO> getOrders();
    void removePendingOrder(Long orderId);
    void handleConfirmedOrder(Order order);
    UserDTO fetchUserDto();

    ViewCartDTO changeQuantityInCart(Map<Long, Integer> idQuantityMap);

    ViewCartDTO deleteProductInCart(List<Long> productIds);

    boolean updateUserEmail(String email);

    boolean updateUserMobileNo(String mobile);

    void updateUserName(String name);

    void addNewAddress(UserAddressDTO addressDTO);

    void updateUserAddress(Long id, UserAddressDTO addressDTO);

    void deleteAddress(Long id);

    void setDefaultAddress(Long addressId);
}
