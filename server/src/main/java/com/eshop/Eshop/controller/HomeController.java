package com.eshop.Eshop.controller;

import com.eshop.Eshop.model.Category;
import com.eshop.Eshop.model.dto.responsedto.ProductResponseDTO;
import com.eshop.Eshop.model.Store;
import com.eshop.Eshop.model.dto.responsedto.StoreResponseDto;
import com.eshop.Eshop.service.CategoryServiceImp;
import com.eshop.Eshop.service.ProductServiceImp;
import com.eshop.Eshop.service.StoreServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/home")
public class HomeController {

    @Autowired
    private  CategoryServiceImp categoryService;

    @Autowired
    private ProductServiceImp productService;

    @Autowired
    private StoreServiceImp storeService;

    @GetMapping("/get-categories")
    public ResponseEntity<?> getCategories() {
        try {
            List<Category> categories = categoryService.getAllCategories();
            return new  ResponseEntity<>(categories, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("not found any category", HttpStatus.NO_CONTENT);
        }
    }

    @GetMapping("/products/category_id")
    public ResponseEntity<?> getProductsByCategory(@RequestParam Long category_id) {
        try {
            List<ProductResponseDTO> products = categoryService.getProductsById(category_id);
            return new ResponseEntity<>(products, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>("no product found", HttpStatus.NO_CONTENT);
        }
    }

    @GetMapping("/stores/category_id")
    public ResponseEntity<?> getStoresByCategoryId(@RequestParam Long category_id) {
        try {
            List<StoreResponseDto> stores = storeService.getStoreResponseDtosByCategoryId(category_id);
            return ResponseEntity.status(HttpStatus.OK).body(stores);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("no stores are found by category id "+category_id);
        }
    }

    @GetMapping("/products/store_id")
    public ResponseEntity<?> getProductsByStoreId(@RequestParam Long store_id) {
        try {
            List<ProductResponseDTO> products = productService.getProductsByStoreId(store_id);
            return new ResponseEntity<>(products, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>("no product found", HttpStatus.NO_CONTENT);
        }
    }
    
    @GetMapping("/products/keyword")
    public ResponseEntity<?> getProductsByKeyword(@RequestParam String keyword) {
        try {
            List<ProductResponseDTO> products = productService.getProductsByKeyword(keyword);

            return new ResponseEntity<>(products, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>("no product found", HttpStatus.NO_CONTENT);
        }
    }

    @GetMapping("/stores")
    public ResponseEntity<?> getStoresForHome() {
        try {
            List<StoreResponseDto> stores = storeService.getAllStoreDto();
            return ResponseEntity.ok(stores);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to fetch stores");
        }
    }

    @GetMapping("/store-id")
    public ResponseEntity<?> getStoreById(@RequestParam Long id) {
        try {
            StoreResponseDto store = storeService.getStoreDtoById(id);
            return ResponseEntity.status(HttpStatus.OK).body(store);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No Store Found");
        }
    }

    // http://localhost:8080/home//products/ids?ids=1,2,3
    @GetMapping("/products/ids")
    public ResponseEntity<?> getProductsByIds(@RequestParam List<Long> ids) {
        try {
            List<ProductResponseDTO> products = productService.getProductsByIds(ids);
            return ResponseEntity.status(HttpStatus.OK).body(products);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error during fetching all products");
        }
    }

    @GetMapping("/products/query")
    public ResponseEntity<?> getProductsByQuery(@RequestParam String query) {
        try {
            List<ProductResponseDTO> products = productService.getProductBySearch(query);
            return ResponseEntity.status(HttpStatus.OK).body(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error during fetching products");
        }
    }

    @GetMapping("/stores/query")
    public ResponseEntity<?> getStoresByQuery(@RequestParam String query) {
        try {
            List<StoreResponseDto> stores = storeService.getStoresDtoBySearch(query);
            return ResponseEntity.status(HttpStatus.OK).body(stores);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error during fetching stores");
        }
    }

}
