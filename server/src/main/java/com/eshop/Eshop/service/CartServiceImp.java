package com.eshop.Eshop.service;

import com.eshop.Eshop.model.*;
import com.eshop.Eshop.model.dto.CartItemDTO;
import com.eshop.Eshop.model.dto.responsedto.OrderSummaryPerStoreDTO;
import com.eshop.Eshop.model.enums.OrderStatus;
import com.eshop.Eshop.repository.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CartServiceImp {

    @Autowired
    private DTOService dtoService;

    @Autowired
    private ProductRepo productRepo;


    public CartItem createCartItem(Long productId, Integer quantity, Cart cart) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product(updateCart-error) not found for Id: "+productId));
        return CartItem.builder()
                .cart(cart) // Associate with the cart
                .product(product)
                .quantity(quantity)
                .isAvailable(product.getStock() > 0)
                .build();
    }

    public Double calTotalCartPrice(List<CartItem> cartItems) {
        return cartItems.stream()
                .mapToDouble(item -> {
                    double originalPrice = item.getProduct().getPrices();
                    // if product have any discount(xy%)
                    if(item.getProduct().getDiscount() != null) {
                        return ((originalPrice * (1.0 - item.getProduct().getDiscount())) * item.getQuantity());
                    } else {
                        return (originalPrice * item.getQuantity());
                    }

                }).sum();
    }

    // return true if product is present
    public boolean updateOrRemoveItem(List<CartItem> cartItems, Long productId, Integer quantity) {
        // Iterate over cart items to update or remove
        for(Iterator<CartItem> itemIterator = cartItems.iterator(); itemIterator.hasNext();) {

            CartItem cartItem = itemIterator.next();

            if(cartItem.getProduct().getId().equals(productId)) {
                // If quantity is less than or equal to zero, remove the item
                if(quantity <= 0) {
                    itemIterator.remove();
                }
                else {
                    // Update the quantity
                    cartItem.setQuantity(quantity);
                    // Update the isAvailable
                    cartItem.setIsAvailable(cartItem.getProduct().getStock() >= quantity);
                }
                return true;
            }
        }
        return  false;
    }

    /*
    *   before Order OrderSummary
    * */
    public List<OrderSummaryPerStoreDTO> getOrderSummaryPerStoreDTO(Cart cart, User user) {
        Map<Store, List<CartItem>> cartItemsPerStore = new HashMap<>();

        cart.getCartItems()
                .forEach(item -> {
                    cartItemsPerStore.computeIfAbsent(item.getProduct().getStore(), n -> new ArrayList<>()).add(item);
                });

        List<OrderSummaryPerStoreDTO> orderSummaryPerStores = cartItemsPerStore.entrySet().stream()
                .map(entry -> {
                    Store store = entry.getKey();
                    List<CartItem> cartItems = entry.getValue();

                    // Calculate the storeSubtotal (sum of product prices * (100 - discount) / 100 * quantities)
                    double storeSubtotal = calTotalCartPrice(cartItems);

                    // Calculate GST (let's assume it's a flat 18%)
                    double gstAmount = storeSubtotal * 0.18;

                    // Delivery cost (assuming a simple flat rate, can be customized)
                    double deliveryCost = 80;

                    // Total = Subtotal + GST + Delivery Cost
                    double total = storeSubtotal + gstAmount + deliveryCost;

                    List<CartItemDTO> cartItemDTOS = cartItems.stream()
                            .map(item -> dtoService.cartItemToDTO(item))
                            .toList();

                    return OrderSummaryPerStoreDTO.builder()
                            .storeId(store.getId())
                            .storeName(store.getName())
                            .shippingType(store.getShippingType())
                            .paymentTypes(store.getPaymentTypes())
                            .cartItems(cartItemDTOS)
                            .gstAmount(gstAmount)
                            .deliveryCost(deliveryCost)
                            .storeSubtotal(storeSubtotal)
                            .Total(total)
                            .build();
                })
                .toList();

        return orderSummaryPerStores;
    }

    public List<OrderPerStore> getOrderPerStore(Cart cart, User user) {
        Map<Store, List<CartItem>> cartItemsPerStore = new HashMap<>();

        cart.getCartItems()
                .forEach(item -> {
                    cartItemsPerStore.computeIfAbsent(item.getProduct().getStore(), n -> new ArrayList<>()).add(item);
                });

        List<OrderPerStore> orderPerStores = cartItemsPerStore.entrySet().stream()
                .map(entry -> {
                    Store store = entry.getKey();
                    List<CartItem> cartItems = entry.getValue();

                    List<OrderItem> orderItems = cartItems.stream()
                            .map(this::getOrderItem)
                            .toList();

                    // Calculate the storeSubtotal (sum of product prices * (100 - discount) / 100 * quantities)
                    double storeSubtotal = calTotalCartPrice(cartItems);

                    // Calculate GST (let's assume it's a flat 18%)
                    double gstAmount = storeSubtotal * 0.18;

                    // Delivery cost (assuming a simple flat rate, can be customized)
                    double deliveryCost = 80;

                    // Total = Subtotal + GST + Delivery Cost
                    double total = storeSubtotal + gstAmount + deliveryCost;

                    return OrderPerStore.builder()
                            .store(store)
                            .storeSubtotal(storeSubtotal)
                            .gstAmount(gstAmount)
                            .deliveryCost(deliveryCost)
                            .total(total)
                            .orderItems(orderItems)
                            .orderStatus(OrderStatus.PENDING)
                            .build();

                })
                .toList();

        return orderPerStores;
    }


    private OrderItem getOrderItem(CartItem cartItem) {

        double finalPrice = getFinalPrice(cartItem);
        return OrderItem.builder()
                .product(cartItem.getProduct())
                .quantity(cartItem.getQuantity())
                .finalPrice(finalPrice)
                .build();
    }

    // product prices * (100 - discount) / 100 * quantities
    private double getFinalPrice(CartItem cartItem) {
        double discount = cartItem.getProduct().getDiscount() == null ? 0.0 : cartItem.getProduct().getDiscount();
        return cartItem.getProduct().getPrices() * (100 - discount) / 100 * cartItem.getQuantity();
    }
}
