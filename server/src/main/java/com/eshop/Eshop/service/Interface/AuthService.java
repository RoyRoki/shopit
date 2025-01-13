package com.eshop.Eshop.service.Interface;

import com.eshop.Eshop.model.dto.UserDetailsImp;
import com.eshop.Eshop.model.dto.requestdto.OTPVerifyRequestDTO;
import com.eshop.Eshop.model.dto.requestdto.UserLoginRequestDTO;
import com.eshop.Eshop.model.dto.requestdto.UserSignUpRequestDTO;
import com.eshop.Eshop.model.dto.responsedto.UserSignUpResponseDTO;
import com.eshop.Eshop.model.User;

public interface AuthService {
    UserSignUpResponseDTO registerNewUser(UserSignUpRequestDTO userSingUpRequestDTO);
    UserSignUpResponseDTO registerNewUserAdmin(UserSignUpRequestDTO userRequest, String admin);
    UserDetailsImp VerifyWithPassAndGetUserDetailsImp(UserLoginRequestDTO requestDTO);
    UserDetailsImp getUserDetailsImp(User user);
    UserDetailsImp getUserDetailsImp(OTPVerifyRequestDTO requestDTO);
}
