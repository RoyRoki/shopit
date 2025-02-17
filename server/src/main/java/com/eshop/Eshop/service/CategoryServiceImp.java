package com.eshop.Eshop.service;

import com.eshop.Eshop.model.Category;
import com.eshop.Eshop.model.dto.responsedto.ProductResponseDTO;
import com.eshop.Eshop.model.Product;
import com.eshop.Eshop.repository.CategoryRepo;
import com.eshop.Eshop.service.Interface.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImp implements CategoryService {

    private final CategoryRepo categoryRepo;
    private final DTOService dtoService;

    public CategoryServiceImp(
        CategoryRepo categoryRepo,
        DTOService dtoService ) {
            
            this.categoryRepo = categoryRepo;
            this.dtoService = dtoService;
    }

    public List<Category> getAllCategories() {
        return categoryRepo.findAll();
    }

    public List<ProductResponseDTO> getProductsById(Long categoryId) {
        List<Product> products = categoryRepo.findProductsByCategoryId(categoryId);
        return products.stream()
                .map(product -> dtoService.productToResponseDto(product))
                .collect(Collectors.toList());
    }
}
