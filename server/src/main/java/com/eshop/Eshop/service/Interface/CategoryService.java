package com.eshop.Eshop.service.Interface;

import com.eshop.Eshop.model.Category;
import com.eshop.Eshop.model.dto.responsedto.ProductResponseDTO;

import java.util.List;

public interface CategoryService {
    List<Category> getAllCategories();
    List<ProductResponseDTO> getProductsById(Long categoryId);
}
