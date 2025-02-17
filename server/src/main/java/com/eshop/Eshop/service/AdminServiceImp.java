package com.eshop.Eshop.service;

import com.eshop.Eshop.exception.custom.AuthenticationException;
import com.eshop.Eshop.exception.custom.DatabaseOperationException;
import com.eshop.Eshop.exception.custom.InvalidInputException;
import com.eshop.Eshop.model.Category;
import com.eshop.Eshop.model.Product;
import com.eshop.Eshop.model.Role;
import com.eshop.Eshop.model.dto.requestdto.CreateStoreRequestDTO;
import com.eshop.Eshop.model.Store;
import com.eshop.Eshop.model.User;
import com.eshop.Eshop.model.dto.requestdto.UserSignUpRequestDTO;
import com.eshop.Eshop.model.dto.responsedto.UserSignUpResponseDTO;
import com.eshop.Eshop.model.enums.ShippingType;
import com.eshop.Eshop.repository.CategoryRepo;
import com.eshop.Eshop.repository.RoleRepo;
import com.eshop.Eshop.repository.UserRepo;
import com.eshop.Eshop.service.Interface.AdminService;
import com.eshop.Eshop.util.AuthenticationContextService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AdminServiceImp implements AdminService {

        @Autowired
        private UserServiceImp userService;

        @Autowired
        private StoreServiceImp storeService;

        @Autowired
        private CategoryRepo categoryRepo;

        @Autowired
        private RoleRepo roleRepo;

        @Autowired
        private UserRepo userRepo;

        @Autowired
        private ProductServiceImp productService;

        @Autowired
        private AuthenticationContextService authenticationContextService;

        @Autowired
        private AwsServiceImp awsServiceImp;

        @Override
        public UserSignUpResponseDTO addNewUserAdmin(UserSignUpRequestDTO requestDTO, String admin) {
                List<Role> roles = new ArrayList<>();
                roleRepo.findByRoleName("ADMIN").ifPresent(roles::add);
                roleRepo.findByRoleName("USER").ifPresent(roles::add);

                User newUser = User.builder()
                                .userName(requestDTO.getUserName())
                                .password(requestDTO.getPassword() + " encoded")
                                .mobileNo(requestDTO.getMobileNo())
                                .roles(roles)
                                .createAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build();

                User savedUser = userRepo.save(newUser);

                return UserSignUpResponseDTO.builder()
                                .userName(requestDTO.getUserName())
                                .mobileNo(requestDTO.getMobileNo())
                                .userId(Long.toString(savedUser.getId()))
                                .build();

        }

        @Override
        public Long createNewStore(CreateStoreRequestDTO requestDTO) {

                User user = userService.getUserById(authenticationContextService.getAuthenticatedUserId());
                Set<Category> categories = requestDTO.getCategoryIds().stream().map(id -> categoryRepo.findById(id)
                                .orElseThrow(() -> new DatabaseOperationException(
                                                "Failed to fetch category id : " + id)))
                                .collect(Collectors.toSet());

                Store newStore = Store.builder()
                                .email(requestDTO.getEmail())
                                .mobileNo(requestDTO.getMobileNo())
                                .categories(categories)
                                .owner(user)
                                .name(requestDTO.getName())
                                .description(requestDTO.getDescription())
                                .houseNo(requestDTO.getHouseNo())
                                .city(requestDTO.getCity())
                                .street(requestDTO.getStreet())
                                .state(requestDTO.getState())
                                .pinCode(requestDTO.getPinCode())
                                .landmark(requestDTO.getLandmark())
                                .isActive(true)
                                .products(new ArrayList<>())
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .shippingType(ShippingType.SELF)
                                .build();

                Store savedStore = storeService.createStore(newStore);
                return savedStore.getId();
        }

        @Override
        public List<String> handleUploadProductImages(MultipartFile[] files, Long productId) {

                // Check if the product belongs to the authenticated user's store. If not, throw an AuthenticationException.
                if (!authenticationContextService.isValidProductOfStore(productId)) {
                        throw new AuthenticationException("You are not authorized to update this product.");
                }

                // Retrieve the product using the productId.
                Product product = productService.getProductById(productId);

                // Initialize an empty list to store image URLs. If the product already has images, use them; otherwise, start fresh.
                List<String> imageUrls = product.getImageUrls() == null ? new ArrayList<>() : product.getImageUrls();

                // Iterate through each uploaded file (image) and upload it to AWS S3.
                for (MultipartFile file : files) {

                        // Upload the file to AWS and get the URL.
                        String imageUrl = awsServiceImp.uploadFile(file);

                        // If the image URL is valid, add it to the list of image URLs.
                        if (imageUrl != null && !imageUrl.isEmpty()) {
                                imageUrls.add(imageUrl);
                        } else {
                                throw new InvalidInputException("uploading failed for null image url from AWS S3 ");
                        }
                }

                // Update the product with the newly added image URLs and set the last modified
                // time to the current time.
                product.setImageUrls(imageUrls);
                product.setUpdatedAt(LocalDateTime.now());

                // Update the product in the database.
                productService.updateProduct(product);

                // Return the list of image URLs.
                return imageUrls;
        }

}
