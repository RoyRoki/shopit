package com.eshop.Eshop.service;

import com.eshop.Eshop.model.Category;
import com.eshop.Eshop.model.dto.responsedto.ProductResponseDTO;
import com.eshop.Eshop.model.Product;
import com.eshop.Eshop.repository.CategoryRepo;
import com.eshop.Eshop.service.Interface.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImp implements CategoryService {

    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private DTOService dtoService;

    public List<Category> getAllCategories() {
        try {
            return categoryRepo.findAll();
        } catch (Exception e) {
            throw new RuntimeException("CategoryServiceImp-getAllCategories-error");
        }
    }

    public List<ProductResponseDTO> getProductsById(Long categoryId) {
        List<Product> products = categoryRepo.findProductsByCategoryId(categoryId);
        return products.stream()
                .map(product -> dtoService.productToResponseDto(product))
                .collect(Collectors.toList());
    }
}
