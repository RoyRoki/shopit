package com.eshop.Eshop.service.Interface;

import com.eshop.Eshop.model.dto.requestdto.CreateStoreRequestDTO;
import com.eshop.Eshop.model.dto.requestdto.UserSignUpRequestDTO;
import com.eshop.Eshop.model.dto.responsedto.UserSignUpResponseDTO;

public interface AdminService {
    UserSignUpResponseDTO addNewUserAdmin(UserSignUpRequestDTO requestDTO, String admin);
    Long createNewStore(CreateStoreRequestDTO requestDTO);
}
