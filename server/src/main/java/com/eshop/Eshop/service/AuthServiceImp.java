package com.eshop.Eshop.service;

import com.eshop.Eshop.model.dto.UserDetailsImp;
import com.eshop.Eshop.model.dto.requestdto.*;
import com.eshop.Eshop.model.dto.responsedto.UserSignUpResponseDTO;
import com.eshop.Eshop.model.User;
import com.eshop.Eshop.repository.UserRepo;
import com.eshop.Eshop.service.Interface.AuthService;
import com.eshop.Eshop.service.helper.RedisService;
import com.eshop.Eshop.util.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImp implements AuthService {

    @Autowired
    private UserServiceImp userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AdminServiceImp adminService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private RedisService redisService;

    @Autowired
    private UserRepo userRepo;

    @Override
    public UserSignUpResponseDTO registerNewUser(UserSignUpRequestDTO userRequest) {

        // Check the mobile No is Verified or not
        if(redisService.isMobileNoVerified(userRequest.getMobileNo())) {
            throw new RuntimeException("unverified mobileNo try to signup-error");
        }

        // MobileNo valid so continue
        userRequest.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        try {
            if(!userService.isUserExist(userRequest.getEmail(), userRequest.getMobileNo())) {
                return userService.addNewUser(userRequest);
            }

            return null;

        } catch (Exception e) {
            throw new RuntimeException("AuthServiceImp-registerNewUser-error");
        }
    }


    @Override
    public UserSignUpResponseDTO registerNewUserAdmin(UserSignUpRequestDTO userRequest, String admin) {
        //Check the mobile No is Verified or not
        if(redisService.isMobileNoVerified(userRequest.getMobileNo())) {
            throw new RuntimeException("unverified mobileNo try to signup-error");
        }

        //mobileNo valid so continue
        userRequest.setPassword(passwordEncoder.encode(userRequest.getPassword()));

        try {
            if(!userService.isUserExist(userRequest.getEmail(), userRequest.getMobileNo()))
                return adminService.addNewUserAdmin(userRequest, admin);

            return null;

        } catch (Exception e) {
            throw new RuntimeException("AuthServiceImp-registerNewUserAdmin-error");
        }
    }



    @Override
    public UserDetailsImp  VerifyWithPassAndGetUserDetailsImp(UserLoginRequestDTO requestDTO) {
        try {
            User user = getUser(requestDTO.getMobileNo(), requestDTO.getEmail());
            if(user != null) {
                if(checkPassword(user, requestDTO.getPassword())) {
                    // Password is correct
                    return getUserDetailsImp(user);
                } else {
                    System.out.println("Try to login with incorrect password!");
                    throw new RuntimeException("Try to login with incorrect password!");
                }
            }
            return null;
        } catch (Exception e) {
            throw new RuntimeException("error during authenticate user with mobile/email password");
        }
    }

    private Boolean checkPassword(User user, String password) {
        String savedPassword = user.getPassword().replace(" encoded", "");
        return passwordEncoder.matches(password, savedPassword);
    }

    private User getUser(String mobileNo, String email) {
        try {
            User user;
            if(email != null)
                user = userService.getUserByEmail(email);
            else user = userService.getUserByMobileNo(mobileNo);
            return user;
        } catch (Exception e) {
            return null;
        }

    }


    @Override
    public UserDetailsImp getUserDetailsImp(User user) {
        return
                UserDetailsImp.builder()
                        .userIdAsName(Long.toString(user.getId()))
                        .password(user.getPassword())
                        .build();
    }


    @Override
    public UserDetailsImp getUserDetailsImp(OTPVerifyRequestDTO requestDTO) {

        String savedHashOtp = otpService.getOTP(requestDTO.getEmail() != null ? requestDTO.getEmail() : requestDTO.getMobileNo());

        // If no otp saved for user then return null
        if(savedHashOtp == null)
            return null;

        String requestOtpHash = otpService.hashMe(requestDTO.getOtp());

        if(savedHashOtp.equals(requestOtpHash)) {
            otpService.deleteOTP(requestDTO.getEmail() != null ? requestDTO.getEmail() : requestDTO.getMobileNo());
            User user;
            if(requestDTO.getEmail() != null)
                user = userService.getUserByEmail(requestDTO.getEmail());
            else user = userService.getUserByMobileNo(requestDTO.getMobileNo());

            return UserDetailsImp.builder()
                    .userIdAsName(Long.toString(user.getId()))
                    .password(user.getPassword())
                    .build();

        }
        return null;
    }

    @Override
    public void handleUpdatePassword(UpdatePasswordDTO passwordDTO) {
        try {
            User user = userService.currentUser();
            boolean isAuthenticated = checkPassword(user, passwordDTO.getOldPassword());
            if(isAuthenticated) {
                user.setPassword(passwordEncoder.encode(passwordDTO.getNewPassword()));
                userRepo.save(user);
            } else {
                throw new RuntimeException("Try to update password with invalid password");
            }
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public void handleUpdatePasswordVaiOtp(UpdatePasswordVaiOtp updateDto) {
        try {
            String key = updateDto.getEmail() != null ? updateDto.getEmail()+":fp:" : updateDto.getMobile() != null ? updateDto.getMobile()+":fp:" : null;
            if(key == null) {
                throw new RuntimeException("Null value provided during update password vai otp.");
            }
            String givenHash = otpService.hashMe(updateDto.getOtp());
            String savedHash = otpService.getOTP(key);

            if(givenHash.equals(savedHash)) {
                otpService.deleteOTP(key);
                // Continue to set new password
                String hashPass = passwordEncoder.encode(updateDto.getNewPassword());
                User user = userService.currentUser();
                user.setPassword(hashPass);
                userRepo.save(user);
            } else {
                throw new RuntimeException("Otp now match");
            }
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }
}
