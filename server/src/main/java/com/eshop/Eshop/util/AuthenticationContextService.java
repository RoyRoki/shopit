package com.eshop.Eshop.util;

import com.eshop.Eshop.model.Store;
import com.eshop.Eshop.repository.ProductRepo;
import com.eshop.Eshop.repository.StoreRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationContextService {

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private StoreRepo storeRepo;

    public Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String user_id = authentication.getName();
        return Long.parseLong(user_id);
    }

    public Long getAuthenticatedStoreId() {
        Long admin_id = getAuthenticatedUserId();
        Store store = storeRepo.findByOwnerId(admin_id).orElseThrow(() -> new RuntimeException("Store not found for admin ID: " + admin_id));
        return store.getId();
    }
    public Store getAuthenticatedStore() {
        Long admin_id = getAuthenticatedUserId();
        return storeRepo.findByOwnerId(admin_id).orElseThrow(() -> new RuntimeException("Store not found for admin ID: " + admin_id));
    }

    public Boolean isValidProductOfStore(Long productId) {
        Long admin_id = getAuthenticatedUserId();
        Store store = storeRepo.findByOwnerId(admin_id).orElseThrow(() -> new RuntimeException("Store not found for admin ID: " + admin_id));
        return productRepo.existsByIdAndStoreId(productId, store.getId());
    }
}
