package com.eshop.Eshop.service;

import com.eshop.Eshop.model.dto.UserDetailsImp;
import com.eshop.Eshop.model.dto.requestdto.*;
import com.eshop.Eshop.model.dto.responsedto.UserSignUpResponseDTO;
import com.eshop.Eshop.exception.custom.InvalidMobileNumberException;
import com.eshop.Eshop.exception.custom.InvalidOTPException;
import com.eshop.Eshop.exception.custom.MobileNumberNotVerifiedException;
import com.eshop.Eshop.exception.custom.UserAlreadyExistsException;
import com.eshop.Eshop.model.User;
import com.eshop.Eshop.repository.UserRepo;
import com.eshop.Eshop.service.Interface.AuthService;
import com.eshop.Eshop.service.helper.RedisService;
import com.eshop.Eshop.util.OtpService;

import jakarta.validation.Valid;

import java.util.Objects;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImp implements AuthService {


    private final UserServiceImp userService;
    private final PasswordEncoder passwordEncoder;
    private final AdminServiceImp adminService;
    private final OtpService otpService;
    private final RedisService redisService;
    private final UserRepo userRepo;

    public AuthServiceImp(UserServiceImp userService, PasswordEncoder passwordEncoder, 
                          AdminServiceImp adminService, OtpService otpService, 
                          RedisService redisService, UserRepo userRepo) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.adminService = adminService;
        this.otpService = otpService;
        this.redisService = redisService;
        this.userRepo = userRepo;
    }

    @Override
    public UserSignUpResponseDTO registerNewUser(UserSignUpRequestDTO userRequest) {

        checkMobileNumberEligibility(userRequest.getMobileNo());

        // Hash the password before saving
        userRequest.setPassword(passwordEncoder.encode(userRequest.getPassword()));

        // Save the new user
        return userService.addNewUser(userRequest); 
    }


    @Override
    public UserSignUpResponseDTO registerNewUserAdmin(UserSignUpRequestDTO userRequest, String admin) {

        checkMobileNumberEligibility(userRequest.getMobileNo());

        // Hash the password before saving
        userRequest.setPassword(passwordEncoder.encode(userRequest.getPassword()));

        // Save the new admin
        return adminService.addNewUserAdmin(userRequest, admin);
    }


    private void checkMobileNumberEligibility(String mobileNo) {

        // Check the mobileNo is not null
        if(Objects.isNull(mobileNo) || mobileNo.trim().isEmpty()) {
            System.out.println("Received mobileNo: " + mobileNo);

            throw new InvalidMobileNumberException("Mobile number cannot be null or empty");
        }

        // Check the mobileNo. is Verified
        if(!redisService.isMobileNoVerified(mobileNo)) {
            throw new MobileNumberNotVerifiedException("Mobile number not verified! Verify via /verify-otp");
        }

        // Check if user already exists
        if(userService.isUserExist(null, mobileNo)) {
            throw new UserAlreadyExistsException("Mobile Number already exists.");
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

    @Override
    public void generateOTP(SignupRequestOtpDTO requestOtpDTO) {

        if(Objects.nonNull(requestOtpDTO.getMobileNo()) && !requestOtpDTO.getMobileNo().trim().isEmpty()) {
            otpService.saveAndSendOTP(requestOtpDTO.getMobileNo(), true);
        } else {
            otpService.saveAndSendOTP(requestOtpDTO.getEmail(), false);
        }
    }

    @Override
    public void generateOtpForUniqueIdentity(SignupRequestOtpDTO requestOtpDTO) {
        if(userService.isUserExist(requestOtpDTO.getEmail(), requestOtpDTO.getMobileNo())) {
            throw new UserAlreadyExistsException("Mobile/Email already exists.");
        }
        generateOTP(requestOtpDTO);
    }

    @Override
    public void authenticateOtpForMobile(SignupRequestOtpVerificationDTO requestDTO) {
        String hashOTP = otpService.hashMe(requestDTO.getOtp());
        String savedHashOtp = otpService.getOTP(requestDTO.getMobileNo());

        if (!hashOTP.equals(savedHashOtp)) {
            throw new InvalidOTPException("Invalid OTP provided.");
        }
    }
}
