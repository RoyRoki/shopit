package com.eshop.Eshop.service.Interface;

import com.eshop.Eshop.model.dto.ProductDTO;
import com.eshop.Eshop.model.dto.requestdto.ProductEditRequestDTO;
import com.eshop.Eshop.model.dto.responsedto.ProductResponseDTO;
import com.eshop.Eshop.model.Product;

import java.util.List;

public interface ProductService {
    List<Product> getProductsByCategoryId(Long id);
    List<ProductResponseDTO> getProductsByKeyword(String word);

    Product getProductById(Long productId);

    void updateProduct(Product product);

    List<ProductResponseDTO> getProductsByStoreId(Long id);

    ProductDTO UpdateProduct(ProductEditRequestDTO requestDTO, Product product);

    List<ProductResponseDTO> getProductsByIds(List<Long> ids);

    List<String> removeImageUrls(List<String> imageUrls, Product product);

    List<ProductResponseDTO> getProductBySearch(String q);

    void deleteProductById(Long productId);
}
