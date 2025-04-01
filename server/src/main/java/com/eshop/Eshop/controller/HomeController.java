package com.eshop.Eshop.controller;

import com.eshop.Eshop.model.Category;
import com.eshop.Eshop.model.dto.responsedto.ProductResponseDTO;
import com.eshop.Eshop.model.dto.responsedto.StoreResponseDto;
import com.eshop.Eshop.service.CategoryServiceImp;
import com.eshop.Eshop.service.ProductServiceImp;
import com.eshop.Eshop.service.StoreServiceImp;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/home")
public class HomeController {

    private final CategoryServiceImp categoryService;
    private final ProductServiceImp productService;
    private final StoreServiceImp storeService;

    public HomeController(
            CategoryServiceImp categoryService,
            ProductServiceImp productService,
            StoreServiceImp storeServic) {

        this.categoryService = categoryService;
        this.productService = productService;
        this.storeService = storeServic;
    }

    /**
     * Retrieves all product categories.
     *
     * @return A list of all categories.
     */
    @GetMapping("/get-categories")
    public ResponseEntity<List<Category>> getCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    /**
     * Retrieves products by category ID.
     *
     * @param category_id The ID of the category.
     * @return A list of products that belong to the specified category.
     */
    @GetMapping("/products/category_id")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByCategory(@RequestParam Long category_id) {
        List<ProductResponseDTO> products = categoryService.getProductsById(category_id);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    /**
     * Retrieves stores by category ID.
     *
     * @param category_id The ID of the category.
     * @return A list of stores associated with the category.
     */
    @GetMapping("/stores/category_id")
    public ResponseEntity<List<StoreResponseDto>> getStoresByCategoryId(@RequestParam Long category_id) {
        List<StoreResponseDto> stores = storeService.getStoreResponseDtosByCategoryId(category_id);
        return ResponseEntity.status(HttpStatus.OK).body(stores);
    }

    /**
     * Retrieves products by store ID.
     *
     * @param store_id The ID of the store.
     * @return A list of products available in the specified store.
     */
    @GetMapping("/products/store_id")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByStoreId(@RequestParam Long store_id) {
        List<ProductResponseDTO> products = productService.getProductsByStoreId(store_id);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    /**
     * Retrieves products that match the given keyword.
     *
     * @param keyword The search keyword.
     * @return A list of products matching the search criteria.
     */
    @GetMapping("/products/keyword")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByKeyword(@RequestParam String keyword) {
        List<ProductResponseDTO> products = productService.getProductsByKeyword(keyword);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    /**
     * Retrieves a store by its ID.
     *
     * @param id The store ID.
     * @return Store details corresponding to the provided ID.
     */
    @GetMapping("/store-id")
    public ResponseEntity<StoreResponseDto> getStoreById(@RequestParam Long id) {
        StoreResponseDto store = storeService.getStoreDtoById(id);
        return ResponseEntity.status(HttpStatus.OK).body(store);
    }

    /**
     * Retrieves multiple products by their IDs.
     *
     * @param ids A list of product IDs.
     * @return A list of products corresponding to the given IDs.
     */
    @GetMapping("/products/ids")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByIds(@RequestParam List<Long> ids) {
        List<ProductResponseDTO> products = productService.getProductsByIds(ids);
        return ResponseEntity.status(HttpStatus.OK).body(products);
    }

    /**
     * Searches for products based on a query string.
     *
     * @param query The search query.
     * @return A list of products matching the query.
     */
    @GetMapping("/products/query")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByQuery(@RequestParam String query) {
        List<ProductResponseDTO> products = productService.getProductBySearch(query);
        return ResponseEntity.status(HttpStatus.OK).body(products);
    }

    /**
     * Searches for stores based on a query string.
     *
     * @param query The search query.
     * @return A list of stores matching the query.
     */
    @GetMapping("/stores/query")
    public ResponseEntity<List<StoreResponseDto>> getStoresByQuery(@RequestParam String query) {
        List<StoreResponseDto> stores = storeService.getStoresDtoBySearch(query);
        return ResponseEntity.status(HttpStatus.OK).body(stores);
    }

}
