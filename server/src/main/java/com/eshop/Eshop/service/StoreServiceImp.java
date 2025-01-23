package com.eshop.Eshop.service;

import com.eshop.Eshop.model.*;
import com.eshop.Eshop.model.dto.ProductDTO;
import com.eshop.Eshop.model.dto.requestdto.AddProductRequestDTO;
import com.eshop.Eshop.model.dto.requestdto.StoreUpdateRequestDTO;
import com.eshop.Eshop.model.dto.responsedto.ProductResponseDTO;
import com.eshop.Eshop.model.dto.responsedto.StoreDTO;
import com.eshop.Eshop.model.dto.responsedto.StoreResponseDto;
import com.eshop.Eshop.model.enums.OrderStatus;
import com.eshop.Eshop.repository.*;
import com.eshop.Eshop.service.Interface.StoreService;
import com.eshop.Eshop.service.helper.CategoryServiceHelper;
import com.eshop.Eshop.service.helper.KeywordServiceHelper;
import com.eshop.Eshop.util.AuthenticationContextService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class StoreServiceImp implements StoreService {
    @Autowired
    private StoreRepo storeRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private AuthenticationContextService authenticationContextService;

    @Autowired
    private DTOService dtoService;

    @Autowired
    private CategoryServiceHelper categoryHelper;

    @Autowired
    private KeywordServiceHelper keywordHelper;

    @Autowired
    private MessageServiceImp messageService;

    @Autowired
    private OrderPerStoreRepo orderPerStoreRepo;

    @Autowired
    private CloudinaryServiceImp cloudinaryService;

    @Override
    public Store createStore(Store store) {
        try{
            return storeRepo.save(store);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public ProductResponseDTO addProduct(AddProductRequestDTO productRequest) {
        try {
            Long admin_id = authenticationContextService.getAuthenticatedUserId();
            Store store = storeRepo.findByOwnerId(admin_id).orElseThrow(() -> new RuntimeException("Store not found for admin ID: " + admin_id));

            Set<Category> categories = categoryHelper.getCategorySetByIdSet(productRequest.getCategoryIds());

            Set<Keyword> keywords = keywordHelper.getKeywordsByStringSet(productRequest.getKeywords());

            Product newProduct = Product.builder()
                    .name(productRequest.getName())
                    .description(productRequest.getDescription())
                    .prices(productRequest.getPrices())
                    .stock(productRequest.getStock())
                    .keywords(keywords)
                    .categories(categories)
                    .store(store)
                    .isActive(false)
                    .tableData("")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            Product savedProduct = productRepo.save(newProduct);
            return dtoService.productToResponseDto(savedProduct);

        } catch (Exception e) {
            throw new RuntimeException("StoreServiceImp-addProduct-error "+e.getMessage());
        }
    }

    public List<Store> getAllStore() {
        return storeRepo.findAll();
    }

    @Override
    public Store findById(Long id) {
        return storeRepo.findById(id).orElseThrow(() -> new RuntimeException("StoreServiceImp-findById-error"));
    }

    @Override
    public List<Store> getStoresByCategoryId(Long categoryId) {
        try {
            return storeRepo.findByCategories_Id(categoryId);
        } catch (Exception e) {
            throw new RuntimeException("StoreServiceImp-getStoreByCategoryId-error "+e.getMessage());
        }
    }

    @Override
    public List<ProductDTO> getAllProduct() {
        Long storeId = authenticationContextService.getAuthenticatedStoreId();
        return productRepo.findByStore_Id(storeId).stream()
                .map(product -> dtoService.productToProductDTO(product))
                .collect(Collectors.toList());
    }

    @Override
    public Address getAddress(Store store) {
        return Address.builder()
                .street(store.getStreet())
                .city(store.getCity())
                .houseNo(store.getHouseNo())
                .state(store.getState())
                .pinCode(store.getPinCode())
                .landmark(store.getLandmark())
                .build();
    }

    @Override
    public Store updateStore(StoreUpdateRequestDTO requestDTO) {
        try {
            Store store = authenticationContextService.getAuthenticatedStore();

            // Update basic details
            if (requestDTO.getName() != null) store.setName(requestDTO.getName());
            if (requestDTO.getEmail() != null) store.setEmail(requestDTO.getEmail());
            if (requestDTO.getDescription() != null) store.setDescription(requestDTO.getDescription());
            if(requestDTO.getMobileNo() != null) store.setMobileNo(requestDTO.getMobileNo());
            if (requestDTO.getIsActive() != null) store.setIsActive(requestDTO.getIsActive());

            // Update address details
            if (requestDTO.getHouseNo() != null) store.setHouseNo(requestDTO.getHouseNo());
            if (requestDTO.getStreet() != null) store.setStreet(requestDTO.getStreet());
            if (requestDTO.getCity() != null) store.setCity(requestDTO.getCity());
            if (requestDTO.getState() != null) store.setState(requestDTO.getState());
            if (requestDTO.getPinCode() != null) store.setPinCode(requestDTO.getPinCode());
            if (requestDTO.getLandmark() != null) store.setLandmark(requestDTO.getLandmark());

            // Update additional details
            if (requestDTO.getLogoUrl() != null) store.setLogoUrl(requestDTO.getLogoUrl());
            if (requestDTO.getHeader() != null) store.setHeader(requestDTO.getHeader());
            if (requestDTO.getAbout() != null) store.setAbout(requestDTO.getAbout());

            // Update categories / By replace the old data
            if (requestDTO.getCategoryIds() != null) {
                Set<Category> categories = requestDTO.getCategoryIds().stream()
                                .map(id -> categoryRepo.findById(id).orElseThrow(() -> new RuntimeException("Category not found for id "+id)))
                                        .collect(Collectors.toSet());

                store.setCategories(categories);
            }

            // Update shipping type
            if (requestDTO.getShippingType() != null) store.setShippingType(requestDTO.getShippingType());

            // Update payment type
            if (requestDTO.getPaymentTypes() != null) store.setPaymentTypes(requestDTO.getPaymentTypes());

            // Set updated timestamp
            store.setUpdatedAt(LocalDateTime.now());

            return storeRepo.save(store);

        } catch (Exception e) {
            throw new RuntimeException("Error in storeServiceImp-updateStore : "+e.getMessage());
        }
    }

    @Override
    public void handleConfirmedOrder(Order order) {
        try {
            order.getOrderPerStores().forEach(orderPerStore -> {
                // Notify store owner
                Store store = orderPerStore.getStore();
                String mobileNo = store.getOwner().getMobileNo();
                messageService.sentMessageToMobile(mobileNo, "New order received. Please check!");
            });

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public List<OrderPerStore> getOrders() {
        try {
            Long storeId = authenticationContextService.getAuthenticatedStoreId();
            return orderPerStoreRepo.findOrdersByStoreId(storeId);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error during fetch orders for store"+e);
        }
    }

    @Override
    public StoreDTO getStore() {
        try {
            Store store = authenticationContextService.getAuthenticatedStore();
            return dtoService.storeToStoreDTO(store);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public List<StoreResponseDto> getAllStoreDto() {
        try {
            return storeRepo.findAll().stream()
                    .map(store -> dtoService.
                            storeToStoreResponseDTO(store)).
                    collect(Collectors.toList());
        } catch (RuntimeException e) {
            throw new RuntimeException("Error during fetch all stores and return storeDto "+e.getMessage());
        }
    }

    @Override
    public StoreResponseDto getStoreDtoById(Long id) {
        return dtoService.storeToStoreResponseDTO(findById(id));
    }

    @Override
    public List<StoreResponseDto> getStoreResponseDtosByCategoryId(Long categoryId) {
        try {
            return storeRepo.findByCategories_Id(categoryId).stream().map(store -> dtoService.storeToStoreResponseDTO(store)).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("StoreServiceImp-getStoreByCategoryId-error "+e.getMessage());
        }
    }


    @Override
    public List<StoreResponseDto> getStoresDtoBySearch(String q) {
        try {
            List<Store> stores = storeRepo.findStoreBySearch(q);
            return stores.stream().map(store -> dtoService.storeToStoreResponseDTO(store)).collect(Collectors.toList());
        } catch (RuntimeException e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public void updateLogoBanner(MultipartFile logo, MultipartFile banner, Long storeId) {
        try {
            Store store = findById(storeId);
            String logoUrl = store.getLogoUrl();
            String bannerUrl = store.getBannerUrl();

            if(logo != null) {
                if(logoUrl != null) {
                    // Remove older one
                    cloudinaryService.deleteImage(logoUrl);
                }
                // Upload logo
                logoUrl = cloudinaryService.uploadImage(logo);
            }
            if(banner != null) {
                if(bannerUrl != null) {
                    // Remove older one
                    cloudinaryService.deleteImage(bannerUrl);
                }
                // Upload banner
                bannerUrl = cloudinaryService.uploadImage(banner);
            }


            if(logoUrl != null) {
                store.setLogoUrl(logoUrl);
            }
            if(bannerUrl != null) {
                store.setBannerUrl(bannerUrl);
            }
            storeRepo.save(store);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }
}
