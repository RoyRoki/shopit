package com.eshop.Eshop.service;

import com.eshop.Eshop.model.*;
import com.eshop.Eshop.model.dto.ProductDTO;
import com.eshop.Eshop.model.dto.TableDto;
import com.eshop.Eshop.model.dto.requestdto.ProductEditRequestDTO;
import com.eshop.Eshop.model.dto.responsedto.ProductResponseDTO;
import com.eshop.Eshop.model.enums.ShippingType;
import com.eshop.Eshop.repository.CategoryRepo;
import com.eshop.Eshop.repository.KeywordsRepo;
import com.eshop.Eshop.repository.ProductRepo;
import com.eshop.Eshop.service.Interface.ProductService;
import com.eshop.Eshop.service.helper.CategoryServiceHelper;
import com.eshop.Eshop.service.helper.KeywordServiceHelper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProductServiceImp implements ProductService {

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private KeywordsRepo keywordsRepo;

    @Autowired
    private DTOService dtoService;

    @Autowired
    private KeywordServiceHelper keywordHelper;

    @Autowired
    private CategoryServiceHelper categoryHelper;

    @Autowired
    private CloudinaryServiceImp cloudinaryService;

    public List<Product> getProductsByCategoryId(Long id) {
        return categoryRepo.findProductsByCategoryId(id);
    }

    public List<ProductResponseDTO> getProductsByKeyword(String word) {
        try {
            List<Product> products = productRepo.findByKeywords_WordAndIsActiveTrue(word);

            return products.stream()
                    .map(product ->
                            dtoService.productToResponseDto(product)).toList();

        } catch (Exception e) {
            throw new RuntimeException("ProductServiceImp-getProductsByKeyword");
        }
    }

    @Override
    public Product getProductById(Long productId) {
        try {
            return productRepo.findById(productId).orElseThrow();
        } catch (Exception e) {
            throw new RuntimeException("ProductServiceImp-getProductById-error");
        }
    }

    @Override
    public void updateProduct(Product product) {
        productRepo.save(product);
    }

    @Override
    public List<ProductResponseDTO> getProductsByStoreId(Long id) {
        try {
            List<Product> products = productRepo.findByStore_IdAndIsActiveTrue(id);
            return products.stream()
                    .map(product -> dtoService.productToResponseDto(product))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("productServiceImp-getProductsByStoreId-error");
        }
    }

    @Override
    public ProductDTO UpdateProduct(ProductEditRequestDTO requestDTO, Product product) {

        if(requestDTO.getTable() != null) {
            ObjectMapper mapper = new ObjectMapper();
            try {
                String jsonObjData = mapper.writeValueAsString(requestDTO.getTable());
                product.setTableData(jsonObjData);

            } catch (JsonProcessingException e) {
                throw new RuntimeException("Failed to convert Table data to json and save");
            }
        }

        if(requestDTO.getName() != null) {
            product.setName(requestDTO.getName());
        }

        if(requestDTO.getDescription() != null) {
            product.setDescription(requestDTO.getDescription());
        }

        if(requestDTO.getStock() != null) {
            product.setStock(requestDTO.getStock());
        }

        if(requestDTO.getPrices() != null) {
            product.setPrices(requestDTO.getPrices());
        }

        if(requestDTO.getDiscount() != null) {
            product.setDiscount(requestDTO.getDiscount());
        }

        if(requestDTO.getKeywords() != null && !requestDTO.getKeywords().isEmpty()) {
            Set<Keyword> existingKeywords = keywordHelper.getKeywordsByStringSet(requestDTO.getKeywords());
            product.setKeywords(existingKeywords);
        }
        if(requestDTO.getCategoryIds() != null && !requestDTO.getCategoryIds().isEmpty()) {
            Set<Category> categories = categoryHelper.getCategorySetByIdSet(requestDTO.getCategoryIds());
            product.setCategories(categories);
        }
        if(requestDTO.getIsActive() != null) {
            product.setIsActive(requestDTO.getIsActive());
        }
        if(requestDTO.getWeight() != null) {
            product.setWeight(requestDTO.getWeight());
        }
        if(requestDTO.getHeight() != null) {
            product.setHeight(requestDTO.getHeight());
        }
        if(requestDTO.getWidth() != null) {
            product.setWidth(requestDTO.getWidth());
        }
        if(requestDTO.getLength() != null) {
            product.setLength(requestDTO.getLength());
        }
        if(requestDTO.getMaterial() != null) {
            product.setMaterial(requestDTO.getMaterial());
        }

        product.setUpdatedAt(LocalDateTime.now());
        Product savedProduct = productRepo.save(product);
        return dtoService.productToProductDTO(savedProduct);
    }

    @Override
    public List<ProductResponseDTO> getProductsByIds(List<Long> ids) {
        try {
            return ids.stream().map(id -> {
                return dtoService.productToResponseDto(productRepo.findById(id).orElse(null));
            }).collect(Collectors.toList());

        } catch (Exception e) {
            throw new RuntimeException("Failed to get products by ids in getProductsByIds-error");
        }
    }

    @Override
    public List<String> removeImageUrls(List<String> imageUrls, Product product) {
        try {
            List<String> oldUrls = product.getImageUrls();
            imageUrls.forEach((url) -> {
                if(oldUrls.contains(url)) {
                    cloudinaryService.deleteImage(url);
                    oldUrls.remove(url);
                }
            });

            // Update the product
            product.setImageUrls(oldUrls);
            product.setUpdatedAt(LocalDateTime.now());
            productRepo.save(product);

            return oldUrls;
        } catch (RuntimeException e) {
            throw new RuntimeException("Error during removing imgUrl from product. "+e);
        }
    }

    @Override
    public List<ProductResponseDTO> getProductBySearch(String q) {
        try {
            List<Product> products = productRepo.findProductBySearch(q);
            return products.stream().map(product -> dtoService.productToResponseDto(product)).collect(Collectors.toList());
        } catch (RuntimeException e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public void deleteProductById(Long productId) {
        try {
            Product product = productRepo.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Error during delete product"));

            try {
                product.getImageUrls().forEach((url) -> {
                    cloudinaryService.deleteImage(url);
                });
            } catch (Exception e) {
                throw new RuntimeException(e);
            }

            productRepo.delete(product);
        } catch (RuntimeException e) {
            throw new RuntimeException(e.getMessage());
        }
    }


}
