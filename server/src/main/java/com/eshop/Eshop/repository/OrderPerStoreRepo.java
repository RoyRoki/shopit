package com.eshop.Eshop.repository;

import com.eshop.Eshop.model.OrderPerStore;
import com.eshop.Eshop.model.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderPerStoreRepo extends JpaRepository<OrderPerStore, Long> {
    @Query("SELECT o FROM OrderPerStore o WHERE o.store.id = :storeId")
    List<OrderPerStore> findOrdersByStoreId(@Param("storeId") Long storeId);

    @Query(value = "SELECT * FROM order_per_store WHERE store_id = :storeId AND order_status = :status", nativeQuery = true)
    List<OrderPerStore> findOrdersByStoreIdAndStatus(@Param("storeId") Long storeId, @Param("status") String status);
}
