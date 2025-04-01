package com.eshop.Eshop.service;

import com.eshop.Eshop.exception.custom.DatabaseOperationException;
import com.eshop.Eshop.exception.custom.ResourceNotFoundException;
import com.eshop.Eshop.model.*;
import com.eshop.Eshop.model.dto.ProductDTO;
import com.eshop.Eshop.model.dto.StoreOrderDto;
import com.eshop.Eshop.model.dto.requestdto.AddProductRequestDTO;
import com.eshop.Eshop.model.dto.requestdto.StoreUpdateRequestDTO;
import com.eshop.Eshop.model.dto.responsedto.StoreDTO;
import com.eshop.Eshop.model.dto.responsedto.StoreResponseDto;
import com.eshop.Eshop.repository.*;
import com.eshop.Eshop.service.Interface.StoreService;
import com.eshop.Eshop.service.helper.CategoryServiceHelper;
import com.eshop.Eshop.service.helper.KeywordServiceHelper;
import com.eshop.Eshop.util.AuthenticationContextService;
import jakarta.transaction.Transactional;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class StoreServiceImp implements StoreService {

    private final StoreRepo storeRepo;
    private final ProductRepo productRepo;
    private final CategoryRepo categoryRepo;
    private final AuthenticationContextService authenticationContextService;
    private final DTOService dtoService;
    private final CategoryServiceHelper categoryHelper;
    private final KeywordServiceHelper keywordHelper;
    private final MessageServiceImp messageService;
    private final OrderPerStoreRepo orderPerStoreRepo;
    private final AwsServiceImp awsServiceImp;
    private final OrderServiceImp orderService;

    public StoreServiceImp(
            StoreRepo storeRepo,
            ProductRepo productRepo,
            CategoryRepo categoryRepo,
            AuthenticationContextService authenticationContextService,
            DTOService dtoService,
            CategoryServiceHelper categoryHelper,
            KeywordServiceHelper keywordHelper,
            MessageServiceImp messageService,
            OrderPerStoreRepo orderPerStoreRepo,
            AwsServiceImp awsServiceImp,
            @Lazy OrderServiceImp orderService) {
        this.storeRepo = storeRepo;
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.authenticationContextService = authenticationContextService;
        this.dtoService = dtoService;
        this.categoryHelper = categoryHelper;
        this.keywordHelper = keywordHelper;
        this.messageService = messageService;
        this.orderPerStoreRepo = orderPerStoreRepo;
        this.awsServiceImp = awsServiceImp;
        this.orderService = orderService;
    }

    @Override
    public Store createStore(Store store) {
        return storeRepo.save(store);
    }

    @Override
    public ProductDTO addProduct(AddProductRequestDTO productRequest) {

        // Fetch Admin's Store
        Store store = getAdminStore();

        // Retrieve Categories & Keywords
        Set<Category> categories = categoryHelper.getCategorySetByIdSet(productRequest.getCategoryIds());
        Set<Keyword> keywords = keywordHelper.getKeywordsByStringSet(productRequest.getKeywords());

        // Build & Save Product
        Product newProduct = buildProduct(productRequest, store, categories, keywords);
        Product savedProduct = productRepo.save(newProduct);

        // Convert to DTO & Return
        return dtoService.productToProductDTO(savedProduct);
    }

    // Helper Method: Fetch Store for Admin
    private Store getAdminStore() {
        Long adminId = authenticationContextService.getAuthenticatedUserId();
        return storeRepo.findByOwnerId(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found for admin ID: " + adminId));
    }

    // Helper Method: Build Product Entity
    private Product buildProduct(AddProductRequestDTO productRequest, Store store, Set<Category> categories,
            Set<Keyword> keywords) {
        return Product.builder()
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
    }

    @Override
    public Store findById(Long id) {
        return storeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with ID: " + id));
    }

    @Override
    public List<Store> getStoresByCategoryId(Long categoryId) {
        return storeRepo.findByCategories_Id(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Stores not found by categoryId : " + categoryId));
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
    public StoreDTO updateStore(StoreUpdateRequestDTO requestDTO) {
        try {
            Store store = authenticationContextService.getAuthenticatedStore();

            // Update basic details
            if (requestDTO.getName() != null)
                store.setName(requestDTO.getName());
            if (requestDTO.getEmail() != null)
                store.setEmail(requestDTO.getEmail());
            if (requestDTO.getDescription() != null)
                store.setDescription(requestDTO.getDescription());
            if (requestDTO.getMobileNo() != null)
                store.setMobileNo(requestDTO.getMobileNo());
            if (requestDTO.getIsActive() != null)
                store.setIsActive(requestDTO.getIsActive());

            // Update address details
            if (requestDTO.getHouseNo() != null)
                store.setHouseNo(requestDTO.getHouseNo());
            if (requestDTO.getStreet() != null)
                store.setStreet(requestDTO.getStreet());
            if (requestDTO.getCity() != null)
                store.setCity(requestDTO.getCity());
            if (requestDTO.getState() != null)
                store.setState(requestDTO.getState());
            if (requestDTO.getPinCode() != null)
                store.setPinCode(requestDTO.getPinCode());
            if (requestDTO.getLandmark() != null)
                store.setLandmark(requestDTO.getLandmark());

            // Update additional details
            if (requestDTO.getLogoUrl() != null)
                store.setLogoUrl(requestDTO.getLogoUrl());
            if (requestDTO.getHeader() != null)
                store.setHeader(requestDTO.getHeader());
            if (requestDTO.getAbout() != null)
                store.setAbout(requestDTO.getAbout());

            // Update categories / By replace the old data
            if (requestDTO.getCategoryIds() != null) {
                Set<Category> categories = requestDTO.getCategoryIds().stream()
                        .map(id -> categoryRepo.findById(id)
                                .orElseThrow(() -> new RuntimeException("Category not found for id " + id)))
                        .collect(Collectors.toSet());

                store.setCategories(categories);
            }

            // Update shipping type
            if (requestDTO.getShippingType() != null)
                store.setShippingType(requestDTO.getShippingType());

            // Update payment type
            if (requestDTO.getPaymentTypes() != null)
                store.setPaymentTypes(requestDTO.getPaymentTypes());

            // Set updated timestamp
            store.setUpdatedAt(LocalDateTime.now());

            storeRepo.save(store);

            return dtoService.storeToStoreDTO(store);

        } catch (Exception e) {
            throw new DatabaseOperationException("Error in storeServiceImp-updateStore : " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void handleConfirmedOrder(Order order) {
        try {
            order.getOrderPerStores().forEach(orderPerStore -> {
                // Notify store owner
                Store store = orderPerStore.getStore();
                String mobileNo = store.getOwner().getMobileNo();
                messageService.sentMessageToMobile(mobileNo, "New order received. Please check!");

                // Reduce stock quantities
                orderPerStore.getOrderItems()
                        .stream()
                        .map(item -> {
                            Product product = item.getProduct();
                            product.setStock((product.getStock() - item.getQuantity()));
                            return product;
                        })
                        .forEach(productRepo::save);
            });

        } catch (Exception e) {
            throw new DatabaseOperationException("Database operation failed : " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public List<StoreOrderDto> getOrders() {
        try {
            Long storeId = authenticationContextService.getAuthenticatedStoreId();
            List<OrderPerStore> orderPerStores = orderPerStoreRepo.findOrdersByStoreId(storeId);

            return orderPerStores.stream()
                    .map(opStore -> {

                        return StoreOrderDto.builder()
                                .storeSubtotal(opStore.getStoreSubtotal())
                                .gstAmount(opStore.getGstAmount())
                                .deliveryCost(opStore.getDeliveryCost())
                                .total(opStore.getTotal())
                                .orderItems(opStore.getOrderItems().stream()
                                        .map(orderItem -> dtoService.orderItemToDTO(orderItem))
                                        .toList())
                                .orderInfo(dtoService.orderToOrderInfo(opStore.getOrder()))
                                .customer(dtoService.userToCustomerDTO(opStore.getOrder().getUser()))
                                .build();
                    })
                    .toList();

        } catch (Exception e) {
            throw new DatabaseOperationException("Error during fetch orders for store" + e);
        }
    }

    @Override
    public StoreDTO getStore() {
        Store store = authenticationContextService.getAuthenticatedStore();
        return dtoService.storeToStoreDTO(store);
    }

    @Override
    public List<StoreResponseDto> getAllStoreDto() {
        return storeRepo.findAll().stream()
                .map(store -> dtoService.storeToStoreResponseDTO(store)).collect(Collectors.toList());
    }

    @Override
    public StoreResponseDto getStoreDtoById(Long id) {
        return dtoService.storeToStoreResponseDTO(findById(id));
    }

    @Override
    public List<StoreResponseDto> getStoreResponseDtosByCategoryId(Long categoryId) {

        return storeRepo.findByCategories_Id(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Stores not found for categoryId : " + categoryId))
                .stream()
                .map(s -> dtoService.storeToStoreResponseDTO(s)).collect(Collectors.toList());

    }

    @Override
    public List<StoreResponseDto> getStoresDtoBySearch(String q) {

        List<Store> stores = storeRepo.findStoreBySearch(q)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found for query : " + q));

        return stores.stream()
            .map(store -> dtoService.storeToStoreResponseDTO(store)).collect(Collectors.toList());
    }

    @Override
    public void updateLogoBanner(MultipartFile logo, MultipartFile banner, Long storeId) {
        try {
            Store store = findById(storeId);
            String logoUrl = store.getLogoUrl();
            String bannerUrl = store.getBannerUrl();

            if (logo != null) {
                if (logoUrl != null) {
                    // Remove older one
                    awsServiceImp.deleteImage(logoUrl);
                }
                // Upload logo
                logoUrl = awsServiceImp.uploadFile(logo);
            }
            if (banner != null) {
                if (bannerUrl != null) {
                    // Remove older one
                    awsServiceImp.deleteImage(bannerUrl);
                }
                // Upload banner
                bannerUrl = awsServiceImp.uploadFile(banner);
            }

            if (logoUrl != null) {
                store.setLogoUrl(logoUrl);
            }
            if (bannerUrl != null) {
                store.setBannerUrl(bannerUrl);
            }
            storeRepo.save(store);
        } catch (Exception e) {
            throw new DatabaseOperationException("Failed to update LogoBanner " + e.getMessage());
        }
    }

    @Override
    public void shippedOrder(Long orderId) {
        Store store = authenticationContextService.getAuthenticatedStore();
        orderService.handleShipped(orderId, store);
    }
}
