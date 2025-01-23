package com.eshop.Eshop.controller;

import com.eshop.Eshop.model.OrderPerStore;
import com.eshop.Eshop.model.Product;
import com.eshop.Eshop.model.Store;
import com.eshop.Eshop.model.dto.ProductDTO;
import com.eshop.Eshop.model.dto.requestdto.AddProductRequestDTO;
import com.eshop.Eshop.model.dto.requestdto.CreateStoreRequestDTO;
import com.eshop.Eshop.model.dto.requestdto.ProductEditRequestDTO;
import com.eshop.Eshop.model.dto.requestdto.StoreUpdateRequestDTO;
import com.eshop.Eshop.model.dto.responsedto.CreateStoreResponseDTO;
import com.eshop.Eshop.model.dto.responsedto.ProductResponseDTO;
import com.eshop.Eshop.model.dto.responsedto.StoreDTO;
import com.eshop.Eshop.service.AdminServiceImp;
import com.eshop.Eshop.service.CloudinaryServiceImp;
import com.eshop.Eshop.service.ProductServiceImp;
import com.eshop.Eshop.service.StoreServiceImp;
import com.eshop.Eshop.util.AuthenticationContextService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminServiceImp adminService;

    @Autowired
    private StoreServiceImp storeService;

    @Autowired
    private ProductServiceImp productService;

    @Autowired
    private CloudinaryServiceImp cloudinaryService;

    @Autowired
    private AuthenticationContextService authContextService;

    @GetMapping("/test")
    public ResponseEntity<?> doTest() {
        return new ResponseEntity<>("Hey Admin create store now in ESHOP",HttpStatus.OK);
    }


    @PostMapping("/create-store")
    public ResponseEntity<?> createStore(@RequestBody CreateStoreRequestDTO createStoreRequest) {
        try {
            Long store_id = adminService.createNewStore(createStoreRequest);
            CreateStoreResponseDTO responseDTO = CreateStoreResponseDTO
                    .builder()
                    .storeId(store_id)
                    .build();
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Store creation Failed", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(value = "/update-store")
    public ResponseEntity<?> updateStore(@RequestBody StoreUpdateRequestDTO requestDTO) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(storeService.updateStore(requestDTO));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error during update the store");
        }
    }

    @PostMapping("/upload-store-logo-banner")
    public ResponseEntity<?> uploadStoreLogoBanner(
            @RequestParam(value = "logo", required = false) MultipartFile logo,
            @RequestParam(value = "banner", required = false) MultipartFile banner,
            @RequestParam("storeId") Long storeId)
    {
            try {
                storeService.updateLogoBanner(logo, banner, storeId);
                return  ResponseEntity.ok("Update successful");
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.badRequest().body("Failed to update");
            }
    }

    @GetMapping(value = "/get-store")
    public ResponseEntity<?> getMyStore() {
        try {
            StoreDTO storeDTO = storeService.getStore();
            return ResponseEntity.status(HttpStatus.OK).body(storeDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error to fetch store");
        }
    }


    @PostMapping("/add-product")
    public ResponseEntity<?> addProduct(@RequestBody AddProductRequestDTO addProductRequest) {
        try {
            ProductResponseDTO responseDTO = storeService.addProduct(addProductRequest);
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Product creation failed", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/upload-images")
    public ResponseEntity<?> uploadProductImages(@RequestParam("images")MultipartFile[] files,
                                                 @RequestParam("product-id") Long productId) {

        if(!authContextService.isValidProductOfStore(productId))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not able to update this product");

        try {
            Product product = productService.getProductById(productId);
            // Remove the Builder because we fix it in product model
            List<String> imageUrls = product.getImageUrls() == null ? new ArrayList<>() : product.getImageUrls();

            for(MultipartFile file : files) {
                String imageUrl = cloudinaryService.uploadImage(file);
                if(imageUrl != null && !imageUrl.isEmpty()) {
                    imageUrls.add(imageUrl);
                }
                else {
                    return new ResponseEntity<>("uploading failed for null image url from cloudinary ", HttpStatus.BAD_REQUEST);
                }
            }

            product.setImageUrls(imageUrls);
            product.setUpdatedAt(LocalDateTime.now());
            productService.updateProduct(product);
            return new ResponseEntity<>(imageUrls, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("uploading failed "+e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(value = "/remove-images")
    public ResponseEntity<?> removeProductImages(@RequestParam("product-id") Long productId,
                                                 @RequestBody List<String> imageUrls) {
        if(!authContextService.isValidProductOfStore(productId))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not able to update this product");
        if(imageUrls.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No imageUrl to remove!");
        }
        try {
            Product product = productService.getProductById(productId);
            List<String> urls = productService.removeImageUrls(imageUrls, product);
            return ResponseEntity.ok(urls);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Update failed");
        }
    }

    @PutMapping("/product-update")
    public ResponseEntity<?> productUpdate(@RequestParam("product-id") Long productId,
                                           @RequestBody ProductEditRequestDTO requestDTO) {

        if(!authContextService.isValidProductOfStore(productId))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not able to update this product");

        try {
            Product product = productService.getProductById(productId);

            ProductDTO responseDTO = productService.UpdateProduct(requestDTO, product);
            return ResponseEntity.status(HttpStatus.OK).body(responseDTO);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Update failed");
        }
    }

    @GetMapping("/my-products")
    public ResponseEntity<?> getStoreProducts() {
        try {
            List<ProductDTO> products = storeService.getAllProduct();
            return ResponseEntity.status(HttpStatus.OK).body(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error during get products of this store");
        }
    }

    @DeleteMapping(value = "/delete-product")
    public ResponseEntity<?> deleteProduct(@RequestParam Long productId) {
        try {
            productService.deleteProductById(productId);
            return ResponseEntity.ok("Successfully Deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete");
        }
    }

    @GetMapping(value = "/orders")
    public ResponseEntity<?> getOrders() {
        try {
            List<OrderPerStore> orders = storeService.getOrders();
            return ResponseEntity.ok(orders);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to fetch order for your store!");
        }
    }
}
