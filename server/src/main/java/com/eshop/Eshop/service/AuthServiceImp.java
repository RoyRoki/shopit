package com.eshop.Eshop.service;

import com.eshop.Eshop.model.dto.UserDetailsImp;
import com.eshop.Eshop.model.dto.requestdto.*;
import com.eshop.Eshop.model.dto.responsedto.JwtRefreshResponseDTO;
import com.eshop.Eshop.model.dto.responsedto.UserLoginResponseDTO;
import com.eshop.Eshop.model.dto.responsedto.UserSignUpResponseDTO;
import com.eshop.Eshop.exception.custom.AuthenticationException;
import com.eshop.Eshop.exception.custom.InvalidJwtTokenException;
import com.eshop.Eshop.exception.custom.InvalidMobileNumberException;
import com.eshop.Eshop.exception.custom.InvalidOTPException;
import com.eshop.Eshop.exception.custom.MobileNumberNotVerifiedException;
import com.eshop.Eshop.exception.custom.UserAlreadyExistsException;
import com.eshop.Eshop.model.User;
import com.eshop.Eshop.repository.UserRepo;
import com.eshop.Eshop.service.Interface.AuthService;
import com.eshop.Eshop.service.helper.RedisService;
import com.eshop.Eshop.util.JwtService;
import com.eshop.Eshop.util.OtpService;
import com.eshop.Eshop.util.RefreshTokenService;

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
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthServiceImp(UserServiceImp userService, PasswordEncoder passwordEncoder, 
                          AdminServiceImp adminService, OtpService otpService, 
                          RedisService redisService, UserRepo userRepo,
                          JwtService jwtService, RefreshTokenService refreshTokenService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.adminService = adminService;
        this.otpService = otpService;
        this.redisService = redisService;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
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

        // Retrieve user details using the provided mobile number or email
        User user = getUser(requestDTO.getMobileNo(), requestDTO.getEmail());

        // Check if the user exists, throw an exception if not found
        if(Objects.isNull(user)) {
            throw new AuthenticationException("User not found with provided credentials.");
        }

        // Validate the provided password against the stored password
        if(!checkPassword(user, requestDTO.getPassword())) {
            throw new AuthenticationException("Incorrect password.");
        }

        // Return user details after successful authentication
        return getUserDetailsImp(user);
    }

    @Override
    public UserDetailsImp getUserDetailsImp(User user) {
        return
                UserDetailsImp.builder()
                        .userIdAsName(Long.toString(user.getId()))
                        .password(user.getPassword())
                        .build();
    }


    /**
     * Retrieves user details after verifying OTP.
     * Redis key + ":lg:" for separate the login otps
     */
    @Override
    public UserDetailsImp getUserDetailsWithOTP(OTPVerifyRequestDTO requestDTO) {

        // Get the stored OTP hash based on email or mobile number
        String identifier = requestDTO.getEmail() != null ? requestDTO.getEmail() : requestDTO.getMobileNo();

        // Append a unique identifier for OTP storage
        identifier = identifier + ":lg:";     

        String savedHashOtp = otpService.getOTP(identifier);

        // If no OTP is found, throw Authenticaiton exception
        if(Objects.isNull(savedHashOtp)) {
            throw new AuthenticationException("Try To Login Without login otp request");
        }

        // Hash the OTP provided by the user
        String requestOtpHash = otpService.hashMe(requestDTO.getOtp());

        // Validate OTP by comparing hashes
        if(!savedHashOtp.equals(requestOtpHash)) {
            throw new InvalidOTPException("Try to login with invalied otp");
        }

        // OTP is correct, so remove it from storage
        otpService.deleteOTP(identifier);

        // Retrieve user details based on the provided identifier
        User user = getUser(requestDTO.getMobileNo(), requestDTO.getEmail());

        // Construct and return authenticated user details
        return getUserDetailsImp(user);
    }

    @Override
    public void handleUpdatePasswordVaiOtp(UpdatePasswordVaiOtp updateDto) {
        
        // Get user using mobile/email
        User user = getUser(updateDto.getMobileNo(), updateDto.getEmail());

        // Check is user exist
        if(Objects.isNull(user)) {
            throw new AuthenticationException("User not found with provided credentials.");
        }

        // Get the stored OTP hash based on email or mobile number
        String identifier = updateDto.getEmail() != null 
                            ? updateDto.getEmail() 
                            : updateDto.getMobileNo();


        // Append a unique identifier for OTP storage
        identifier = identifier + ":fp:";

        // Retrieve the saved OTP hash from storage
        String savedHash = otpService.getOTP(identifier);
        
        // If no OTP is found, throw Authenticaiton exception
        if(Objects.isNull(savedHash)) {
            throw new AuthenticationException("Try To Login Without login otp request");
        }

        // Hash the provided OTP for comparison
        String givenHash = otpService.hashMe(updateDto.getOtp());

        // Validate the OTP
        if(!savedHash.equals(givenHash)) {
            throw new InvalidOTPException("Try to login with invalied otp");
        }

        // OTP is valid, delete it from storage
        otpService.deleteOTP(identifier);

        // Encode the new password and update user record
        String hashPass = passwordEncoder.encode(updateDto.getNewPassword());
        
        // Update the user
        userService.updateUserPassword(hashPass, user);
    }

    @Override
    public void generateOTP(SignupRequestOtpDTO requestOtpDTO) {
        // Check that user is present
        if(!userService.isUserExist(requestOtpDTO.getEmail(), requestOtpDTO.getMobileNo())) {
            throw new UserAlreadyExistsException("Mobile/Email is not exists and try to get otp.");
        }

        // Use Otp service
        if(Objects.nonNull(requestOtpDTO.getMobileNo()) && !requestOtpDTO.getMobileNo().trim().isEmpty()) {
            otpService.saveAndSendOTP(requestOtpDTO.getMobileNo(), true);
        } else {
            otpService.saveAndSendOTP(requestOtpDTO.getEmail(), false);
        }
    }

    @Override
    public void generateOtpForUniqueIdentity(SignupRequestOtpDTO requestOtpDTO) {

        // Check for new User
        if(userService.isUserExist(requestOtpDTO.getEmail(), requestOtpDTO.getMobileNo())) {
            throw new UserAlreadyExistsException("Mobile/Email already exists.");
        }
        // Generate and send OTP
        if(Objects.nonNull(requestOtpDTO.getMobileNo()) && !requestOtpDTO.getMobileNo().trim().isEmpty()) {
            otpService.saveAndSendOTP(requestOtpDTO.getMobileNo(), true);
        } else {
            otpService.saveAndSendOTP(requestOtpDTO.getEmail(), false);
        }
    }

    @Override
    public void authenticateOtpForMobile(SignupRequestOtpVerificationDTO requestDTO) {
        String hashOTP = otpService.hashMe(requestDTO.getOtp());
        String savedHashOtp = otpService.getOTP(requestDTO.getMobileNo());

        if (!hashOTP.equals(savedHashOtp)) {
            throw new InvalidOTPException("Invalid OTP provided.");
        }

        // Saved the mobile as verified.
        redisService.savedVerifiedMobileNo(requestDTO.getMobileNo());
    }

    @Override
    public UserLoginResponseDTO handleLogin(UserLoginRequestDTO requestDTO) {
        UserDetailsImp authenticatedUser = VerifyWithPassAndGetUserDetailsImp(requestDTO);
        return buildLoginResponse(authenticatedUser);
    }

    /**
     * Redis key + ":lg:" for separate the login otps
     */
    @Override
    public void handleSendOTPForLogin(SignupRequestOtpDTO requestOtpDTO) {

        // Check if the user exists before sending OTP
        if(!userService.isUserExist(requestOtpDTO.getEmail(), requestOtpDTO.getMobileNo())) {
            throw new AuthenticationException("User not found. Please check the email or mobile number.");
        }
        
        // Generate and send OTP
        if(Objects.nonNull(requestOtpDTO.getMobileNo()) && !requestOtpDTO.getMobileNo().trim().isEmpty()) {
            otpService.saveAndSendOTP(requestOtpDTO.getMobileNo() + ":lg:", true);
        } else {
            otpService.saveAndSendOTP(requestOtpDTO.getEmail() + ":lg:", false);
        }
    }

    @Override
    public UserLoginResponseDTO handleLoginUsingOTP(OTPVerifyRequestDTO requestDTO) {
        UserDetailsImp authenticatedUser = getUserDetailsWithOTP(requestDTO);
        return buildLoginResponse(authenticatedUser);
    }

    /**
     * Redis key + ":fp:" for separate the forgetpassewords otps
     */
    @Override
    public void handleForgetPassRequest(MobileOrEmailRequestDTO requestDTO) {

        // Check if the user exists before sending OTP
        if(!userService.isUserExist(requestDTO.getEmail(), requestDTO.getMobileNo())) {
            throw new AuthenticationException("User not found. Please check the email or mobile number.");
        }

        // Send OTP based on the available contact method
        if(Objects.nonNull(requestDTO.getMobileNo()) && !requestDTO.getMobileNo().trim().isEmpty()) {
            otpService.saveAndSendOTP(requestDTO.getMobileNo()+ ":fp:", true);
        } else {
            otpService.saveAndSendOTP(requestDTO.getEmail()+ ":fp:", false);
        }

    }

    private Boolean checkPassword(User user, String password) {
        String savedPassword = user.getPassword().replace(" encoded", "");
        return passwordEncoder.matches(password, savedPassword);
    }

    private User getUser(String mobileNo, String email) {
        if(email != null) {
            return userService.getUserByEmail(email);
        }
        else return userService.getUserByMobileNo(mobileNo);

    }

    private UserLoginResponseDTO buildLoginResponse(UserDetailsImp authenticatedUser) {
        String jwt = jwtService.generateToken(authenticatedUser);
        String refreshToken = refreshTokenService.generateRefreshToken();

        refreshTokenService.saveRefreshToken(authenticatedUser, refreshToken);

        return UserLoginResponseDTO.builder()
                        .id(authenticatedUser.getUserIdAsName())
                        .jwt(jwt)
                        .refreshToken(refreshToken)
                        .expiresIn(jwtService.getExpirationTime())
                        .build();
    }

    private JwtRefreshResponseDTO buildJwtRefreshResponse(UserDetailsImp authenticatedUser) {
        String jwt = jwtService.generateToken(authenticatedUser);
        String refreshToken = refreshTokenService.generateRefreshToken();

        refreshTokenService.saveRefreshToken(authenticatedUser, refreshToken);
        
        return JwtRefreshResponseDTO.builder()
                        .jwt(jwt)
                        .refreshToken(refreshToken)
                        .expiresIn(jwtService.getExpirationTime())
                        .build();
    }


    /**
     * Handles the refresh token process by validating the provided refresh token,
     * retrieving the associated user, and generating a new JWT token.
     *
     * @param requestDTO Contains the refresh token that needs to be validated.
     * @return A {@code JwtRefreshResponseDTO} containing the new access token and refresh token.
     * @throws InvalidJwtTokenException If the provided refresh token is invalid.
     * @throws AuthenticationException If no valid user is found for the refresh token.
     */
    public JwtRefreshResponseDTO UseRefreshToken(JwtRefreshRequestDTO requestDTO) {

        // Check if the provided refresh token is valid
        if(!refreshTokenService.isValid(requestDTO.getRefreshToken())) {
            throw new InvalidJwtTokenException("Provided RefreshToken Is Invalid.");
        }

        // Retrieve the user ID associated with the refresh token
        Long userId = refreshTokenService.getUserIdByRefreshToken(requestDTO.getRefreshToken());

        // Fetch the user based on the retrieved user ID
        User user = userService.getUserById(userId);

        // Validate the user object
        if(Objects.isNull(user)) {
            throw new AuthenticationException("Invalid User by refresh token");
        }

        // Expire the old refresh token to prevent reuse
        refreshTokenService.expireTokenNow(requestDTO.getRefreshToken());

        // Convert the User entity to a UserDetails implementation for authentication
        UserDetailsImp userDetails = getUserDetailsImp(user);
        
        // Build and return the new JWT refresh response
        return buildJwtRefreshResponse(userDetails);
    }

}
