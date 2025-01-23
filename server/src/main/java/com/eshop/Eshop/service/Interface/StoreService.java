package com.eshop.Eshop.service.Interface;

import com.eshop.Eshop.model.*;
import com.eshop.Eshop.model.dto.ProductDTO;
import com.eshop.Eshop.model.dto.requestdto.AddProductRequestDTO;
import com.eshop.Eshop.model.dto.requestdto.StoreUpdateRequestDTO;
import com.eshop.Eshop.model.dto.responsedto.ProductResponseDTO;
import com.eshop.Eshop.model.dto.responsedto.StoreDTO;
import com.eshop.Eshop.model.dto.responsedto.StoreResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface StoreService {

    Store createStore(Store store);
    ProductResponseDTO addProduct(AddProductRequestDTO addProductRequest);
    List<Store> getAllStore();

    Store findById(Long id);
    List<Store> getStoresByCategoryId(Long categoryId);

    List<ProductDTO> getAllProduct();
    Address getAddress(Store store);

    Store updateStore(StoreUpdateRequestDTO requestDTO);
    void handleConfirmedOrder(Order order);

    List<OrderPerStore> getOrders();

    StoreDTO getStore();
    List<StoreResponseDto> getAllStoreDto();
    StoreResponseDto getStoreDtoById(Long id);

    List<StoreResponseDto> getStoreResponseDtosByCategoryId(Long categoryId);

    List<StoreResponseDto> getStoresDtoBySearch(String q);

    void updateLogoBanner(MultipartFile logo, MultipartFile banner, Long storeId);
}
