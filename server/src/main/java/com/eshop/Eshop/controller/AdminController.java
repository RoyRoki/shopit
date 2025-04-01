package com.eshop.Eshop.controller;

import com.eshop.Eshop.model.dto.ProductDTO;
import com.eshop.Eshop.model.dto.StoreOrderDto;
import com.eshop.Eshop.model.dto.requestdto.AddProductRequestDTO;
import com.eshop.Eshop.model.dto.requestdto.CreateStoreRequestDTO;
import com.eshop.Eshop.model.dto.requestdto.ProductEditRequestDTO;
import com.eshop.Eshop.model.dto.requestdto.StoreUpdateRequestDTO;
import com.eshop.Eshop.model.dto.responsedto.StoreDTO;
import com.eshop.Eshop.service.AdminServiceImp;
import com.eshop.Eshop.service.ProductServiceImp;
import com.eshop.Eshop.service.StoreServiceImp;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminServiceImp adminService;
    private final StoreServiceImp storeService;
    private final ProductServiceImp productService;

    public AdminController(
            AdminServiceImp adminService,
            StoreServiceImp storeService,
            ProductServiceImp productService) {

        this.adminService = adminService;
        this.productService = productService;
        this.storeService = storeService;
    }

    /**
     * Creates a new store based on the provided request data.
     * 
     * @param createStoreRequest DTO containing store details.
     * @return ResponseEntity containing the created store's ID.
     */
    @PostMapping("/create-store")
    public ResponseEntity<String> createStore(@RequestBody CreateStoreRequestDTO createStoreRequest) {

        Long store_id = adminService.createNewStore(createStoreRequest);
        return ResponseEntity.ok("Store Created Successfully with id : "+store_id);
    }

    /**
     * Updates store details.
     * 
     * @param requestDTO DTO containing updated store information.
     * @return ResponseEntity containing the updated store details.
     */
    @PostMapping(value = "/update-store")
    public ResponseEntity<StoreDTO> updateStore(@RequestBody StoreUpdateRequestDTO requestDTO) {
        StoreDTO store = storeService.updateStore(requestDTO);
        return ResponseEntity.ok(store);
    }

    /**
     * Uploads a store logo and/or banner image.
     * 
     * @param logo    Store logo (optional).
     * @param banner  Store banner (optional).
     * @param storeId ID of the store to which the images belong.
     * @return ResponseEntity with a success message.
     */
    @PostMapping("/upload-store-logo-banner")
    public ResponseEntity<String> uploadStoreLogoBanner(
            @RequestParam(required = false) MultipartFile logo,
            @RequestParam(required = false) MultipartFile banner,
            @RequestParam Long storeId) {

        storeService.updateLogoBanner(logo, banner, storeId);
        return ResponseEntity.ok("Update successful");
    }

    /**
     * Retrieves the details of the currently authenticated user's store.
     * 
     * @return ResponseEntity containing the store details.
     */
    @GetMapping(value = "/get-store")
    public ResponseEntity<StoreDTO> getMyStore() {

        StoreDTO storeDTO = storeService.getStore();
        return ResponseEntity.ok(storeDTO);
    }

    /**
     * Adds a new product to the store.
     * 
     * @param addProductRequest DTO containing product details.
     * @return ResponseEntity containing the created product details.
     */
    @PostMapping("/add-product")
    public ResponseEntity<ProductDTO> addProduct(@RequestBody AddProductRequestDTO addProductRequest) {
         
        ProductDTO savedProduct = storeService.addProduct(addProductRequest);
        return ResponseEntity.ok(savedProduct);
    }

    /**
     * Uploads images for a specific product.
     * 
     * @param files     Array of image files to be uploaded.
     * @param productId ID of the product to which images belong.
     * @return ResponseEntity containing a list of uploaded image URLs.
     */
    @PostMapping("/upload-images")
    public ResponseEntity<List<String>> uploadProductImages(@RequestParam("images") MultipartFile[] files,
            @RequestParam("product-id") Long productId) {
         
        List<String> imageUrls = adminService.handleUploadProductImages(files, productId);
        return ResponseEntity.ok(imageUrls);
    }

    /**
     * Removes images from a product.
     * 
     * @param productId ID of the product whose images are to be removed.
     * @param imageUrls List of image URLs to be removed.
     * @return ResponseEntity containing the remaining image URLs.
     */
    @PostMapping(value = "/remove-images")
    public ResponseEntity<List<String>> removeProductImages(@RequestParam("product-id") Long productId,
            @RequestBody List<String> imageUrls) {
        
        List<String> urls = productService.removeImageUrls(imageUrls, productId);
        return ResponseEntity.ok(urls);
    }

    /**
     * Updates product details.
     * 
     * @param productId  ID of the product to update.
     * @param requestDTO DTO containing updated product details.
     * @return ResponseEntity containing the updated product details.
     */
    @PutMapping("/product-update")
    public ResponseEntity<ProductDTO> productUpdate(@RequestParam("product-id") Long productId,
            @RequestBody ProductEditRequestDTO requestDTO) {
      
        ProductDTO responseDTO = productService.UpdateProduct(requestDTO, productId);
        return ResponseEntity.ok(responseDTO);
    }

    /**
     * Retrieves all products associated with the authenticated user's store.
     * 
     * @return ResponseEntity containing a list of products.
     */
    @GetMapping("/my-products")
    public ResponseEntity<List<ProductDTO>> getStoreProducts() {
 
        List<ProductDTO> products = storeService.getAllProduct();
        return ResponseEntity.ok(products);
    }

    /**
     * Deletes a product from the store.
     * 
     * @param productId ID of the product to delete.
     * @return ResponseEntity with a success message.
     */
    @DeleteMapping(value = "/delete-product")
    public ResponseEntity<String> deleteProduct(@RequestParam Long productId) {
   
        productService.deleteProductById(productId);
        return ResponseEntity.ok("Successfully Deleted");
    }

    /**
     * Retrieves all orders for the authenticated user's store.
     * 
     * @return ResponseEntity containing a list of store orders.
     */
    @GetMapping(value = "/orders")
    public ResponseEntity<List<StoreOrderDto>> getOrders() {
   
        List<StoreOrderDto> orders = storeService.getOrders();
        return ResponseEntity.ok(orders);
    }

    /**
     * Marks an order as shipped.
     * 
     * @param orderId ID of the order to be marked as shipped.
     * @return ResponseEntity with a success message.
     */
    @PutMapping("shipped/{orderId}")
    public ResponseEntity<String> shippedOrder(@PathVariable Long orderId) {
 
        storeService.shippedOrder(orderId);
        return ResponseEntity.ok("Order Shipped");
    }
}
