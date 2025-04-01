package com.eshop.Eshop.service.helper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eshop.Eshop.model.Order;
import com.eshop.Eshop.model.OrderPerStore;
import com.eshop.Eshop.model.Store;
import com.eshop.Eshop.model.enums.OrderStatus;
import com.eshop.Eshop.repository.OrderPerStoreRepo;
import com.eshop.Eshop.service.MessageServiceImp;

@Service
public class UpdateServiceHelper {
      @Autowired
      private MessageServiceImp messageService;

      @Autowired
      private OrderPerStoreRepo orderPerStoreRepo;

      public void handleShippedOrder(Order order, Store store) {

            try {
                  // @Fix order have mul. orderPerStore, this is for only one ops.
                  messageService.sentMessageToMobile(order.getUser().getMobileNo(),
                              "Hey " + order.getUser().getUserName() + "\nOrder Shipped id: " + order.getId()
                                          + "\n Total cost: " + order.getGrandPrice());

                  OrderPerStore orderPerStore = order.getOrderPerStores().stream()
                              .filter((ops) -> store.equals(ops.getStore()))
                              .findFirst().orElseThrow();

                  orderPerStore.setOrderStatus(OrderStatus.SHIPPED);
                  orderPerStoreRepo.save(orderPerStore);

                  messageService.sentMessageToMobile(store.getMobileNo(), "Order Shipped. Please check!");

            } catch (Exception e) {
                  throw new RuntimeException("Database operation failed : " + e.getMessage());
            }
      }
}
