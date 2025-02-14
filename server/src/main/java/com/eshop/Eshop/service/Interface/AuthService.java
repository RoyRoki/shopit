package com.eshop.Eshop.service.Interface;

import com.eshop.Eshop.model.dto.UserDetailsImp;
import com.eshop.Eshop.model.dto.requestdto.*;
import com.eshop.Eshop.model.dto.responsedto.JwtRefreshResponseDTO;
import com.eshop.Eshop.model.dto.responsedto.UserLoginResponseDTO;
import com.eshop.Eshop.model.dto.responsedto.UserSignUpResponseDTO;
import com.eshop.Eshop.model.User;

public interface AuthService {

    UserSignUpResponseDTO registerNewUser(UserSignUpRequestDTO userSingUpRequestDTO);
    UserSignUpResponseDTO registerNewUserAdmin(UserSignUpRequestDTO userRequest, String admin);

    void generateOTP(SignupRequestOtpDTO requestOtpDTO);
    void generateOtpForUniqueIdentity(SignupRequestOtpDTO requestOtpDTO);
    void authenticateOtpForMobile(SignupRequestOtpVerificationDTO requestDTO);
    void handleSendOTPForLogin(SignupRequestOtpDTO requestOtpDTO);

    UserDetailsImp VerifyWithPassAndGetUserDetailsImp(UserLoginRequestDTO requestDTO);
    UserDetailsImp getUserDetailsImp(User user);
    UserDetailsImp getUserDetailsWithOTP(OTPVerifyRequestDTO requestDTO);

    UserLoginResponseDTO handleLogin(UserLoginRequestDTO requestDTO);
    UserLoginResponseDTO handleLoginUsingOTP(OTPVerifyRequestDTO requestDTO);

    void handleForgetPassRequest(MobileOrEmailRequestDTO requestDTO);
    void handleUpdatePasswordVaiOtp(UpdatePasswordVaiOtp updatePasswordVaiOtpDto);
    
    JwtRefreshResponseDTO UseRefreshToken(JwtRefreshRequestDTO requestDTO);
}
