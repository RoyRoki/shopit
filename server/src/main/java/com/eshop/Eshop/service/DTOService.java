package com.eshop.Eshop.service;

import com.eshop.Eshop.model.*;
import com.eshop.Eshop.model.dto.*;
import com.eshop.Eshop.model.dto.responsedto.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DTOService {

    public ProductDTO productToProductDTO(Product product) {
        return
                ProductDTO.builder()
                        .id(product.getId())
                        .isActive(product.getIsActive())
                        .name(product.getName())
                        .description(product.getDescription())
                        .prices(product.getPrices())
                        .discount(product.getDiscount())
                        .stock(product.getStock())
                        .imageUrls(product.getImageUrls())
                        .videoUrls(product.getVideoUrls())
                        .tableDto(getTableDto(product.getTableData()))
                        .keywords(product.getKeywords())
                        .categories(product.getCategories())
                        .length(product.getLength())
                        .width(product.getWidth())
                        .height(product.getHeight())
                        .weight(product.getWeight())
                        .material(product.getMaterial())
                        .createdAt(product.getCreatedAt())
                        .updatedAt(product.getUpdatedAt())
                        .build();
    }

    public ProductResponseDTO productToResponseDto(Product product) {
        //if null product occurs
        if(product == null) {
            return null;
        }
        return
                ProductResponseDTO.builder()
                .productId(product.getId())
                .prices(product.getPrices())
                .discount(product.getDiscount())
                .stock(product.getStock())
                .productName(product.getName())
                .description(product.getDescription())
                .storeId(product.getStore().getId())
                .storeName(product.getStore().getName())
                .categoryIds(product.getCategories().stream().map(Category::getId).collect(Collectors.toSet()))
                .keywords(product.getKeywords().stream().map(Keyword::getWord).collect(Collectors.toSet()))
                .imageUrls(product.getImageUrls())
                .videoUrls(product.getVideoUrls())
                .tableDto(getTableDto(product.getTableData()))
                .isActive(product.getIsActive())
                .length(product.getLength())
                .width(product.getWidth())
                .height(product.getHeight())
                .weight(product.getWeight())
                .material(product.getMaterial())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    public TableDto getTableDto(String tableInJson) {
        if(tableInJson == null || tableInJson.isEmpty())
            return null;

        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(tableInJson, TableDto.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert json to TableDto object");
        }
    }

    public UserDTO UserToUserDTO(User user) {
        return
                UserDTO.builder()
                        .id(user.getId())
                        .userName(user.getUserName())
                        .email(user.getEmail())
                        .mobileNo(user.getMobileNo())
                        .addresses(user.getAddresses())
                        .defaultAddressId(user.getDefaultAddressId())
                        .roles(user.getRoles())
                        .profileUrl(user.getProfileUrl())
                        .build();
    }

    public CartItemDTO cartItemToDTO(CartItem cartItem) {
        return CartItemDTO.builder()
                .product(productToProductDTO(cartItem.getProduct()))
                .quantity(cartItem.getQuantity())
                .isAvailable(cartItem.getProduct().getStock() >= cartItem.getQuantity())
                .build();
    }

    public CartSummaryDTO OrderPerStoreToCartSummary(List<OrderPerStoreDTO> orderPerStores, Cart cart) {
        double cartSubtotal = orderPerStores.stream()
                .mapToDouble(OrderPerStoreDTO::getStoreSubtotal)
                .sum();

        double totalGstAmount = orderPerStores.stream()
                .mapToDouble(OrderPerStoreDTO::getGstAmount)
                .sum();

        double totalDeliveryCost = orderPerStores.stream()
                .mapToDouble(OrderPerStoreDTO::getDeliveryCost)
                .sum();

        double grantTotal = cartSubtotal + totalGstAmount + totalDeliveryCost;

        return CartSummaryDTO.builder()
                .cartId(cart.getId())
                .orderPerStore(orderPerStores)
                .cartSubtotal(cartSubtotal)
                .totalGstAmount(totalGstAmount)
                .totalDeliveryCost(totalDeliveryCost)
                .grandTotal(grantTotal)
                .build();
    }

    public StoreDTO storeToStoreDTO(Store store) {
        return
                StoreDTO.builder()
                        .id(store.getId())
                        .name(store.getName())
                        .email(store.getEmail())
                        .mobileNo(store.getMobileNo())
                        .description(store.getDescription())
                        .isActive(store.getIsActive())
                        .houseNo(store.getHouseNo())
                        .street(store.getStreet())
                        .city(store.getCity())
                        .state(store.getState())
                        .pinCode(store.getPinCode())
                        .landmark(store.getLandmark())
                        .logoUrl(store.getLogoUrl())
                        .bannerUrl(store.getBannerUrl())
                        .header(store.getHeader())
                        .about(store.getAbout())
                        .createdAt(store.getCreatedAt())
                        .updatedAt(store.getUpdatedAt())
                        .shippingType(store.getShippingType())
                        .categories(store.getCategories())
                        .build();
    }

    private AdminDTO userToAdminDTO(User user) {
        return
                AdminDTO.builder()
                        .id(user.getId())
                        .userName(user.getUserName())
                        .email(user.getEmail())
                        .addresses(user.getAddresses())
                        .profileUrl(user.getProfileUrl())
                        .build();
    }

    public StoreResponseDto storeToStoreResponseDTO(Store store) {
        return
                StoreResponseDto.builder()
                        .id(store.getId())
                        .name(store.getName())
                        .description(store.getDescription())
                        .email(store.getEmail())
                        .state(store.getState())
                        .city(store.getCity())
                        .categoryIds(store.getCategories().stream().map(Category::getId).collect(Collectors.toSet()))
                        .logoUrl(store.getLogoUrl())
                        .bannerUrl(store.getBannerUrl())
                        .header(store.getHeader())
                        .about(store.getAbout())
                        .createdAt(store.getCreatedAt())
                        .build();
    }

    public ViewCartDTO cartToViewCartDTO(Cart cart) {
        return
                ViewCartDTO.builder()
                        .id(cart.getId())
                        .totalCartPrice(cart.getTotalCartPrice())
                        .cartItems(cart.getCartItems()
                                .stream()
                                .map(this::cartItemToDTO).collect(Collectors.toList()))
                        .build();
    }
}
