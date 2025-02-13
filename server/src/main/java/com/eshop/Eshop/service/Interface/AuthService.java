package com.eshop.Eshop.service.Interface;

import com.eshop.Eshop.model.dto.UserDetailsImp;
import com.eshop.Eshop.model.dto.requestdto.*;
import com.eshop.Eshop.model.dto.responsedto.UserSignUpResponseDTO;
import com.eshop.Eshop.model.User;

public interface AuthService {

    UserSignUpResponseDTO registerNewUser(UserSignUpRequestDTO userSingUpRequestDTO);
    UserSignUpResponseDTO registerNewUserAdmin(UserSignUpRequestDTO userRequest, String admin);

    void generateOTP(SignupRequestOtpDTO requestOtpDTO);
    void generateOtpForUniqueIdentity(SignupRequestOtpDTO requestOtpDTO);
    void authenticateOtpForMobile(SignupRequestOtpVerificationDTO requestDTO);
    
    UserDetailsImp VerifyWithPassAndGetUserDetailsImp(UserLoginRequestDTO requestDTO);
    UserDetailsImp getUserDetailsImp(User user);
    UserDetailsImp getUserDetailsImp(OTPVerifyRequestDTO requestDTO);

    void handleUpdatePassword(UpdatePasswordDTO passwordDTO);

    void handleUpdatePasswordVaiOtp(UpdatePasswordVaiOtp updatePasswordVaiOtpDto);
}
