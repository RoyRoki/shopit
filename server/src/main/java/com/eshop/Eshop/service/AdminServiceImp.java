package com.eshop.Eshop.service;

import com.eshop.Eshop.model.Category;
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
    private AuthenticationContextService authenticationContextService;

    @Override
    public UserSignUpResponseDTO addNewUserAdmin(UserSignUpRequestDTO requestDTO, String admin) {
        List<Role> roles = new ArrayList<>();
        roleRepo.findByRoleName("ADMIN").ifPresent(roles::add);
        roleRepo.findByRoleName("USER").ifPresent(roles::add);

        User newUser = User.builder()
                .userName(requestDTO.getUserName())
                .password(requestDTO.getPassword()+" encoded")
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
        try {
            User user = userService.getUserById(authenticationContextService.getAuthenticatedUserId());
            Set<Category> categories = requestDTO.getCategoryIds().stream().map(id ->
                    categoryRepo.findById(id).orElseThrow()
                    ).collect(Collectors.toSet());

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

        } catch (Exception e) {
            throw new RuntimeException("AdminServiceImp-createNewStore-Error");
        }

    }

}
