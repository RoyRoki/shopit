package com.eshop.Eshop.controller;

import com.eshop.Eshop.model.dto.DevOtpDTO;
import com.eshop.Eshop.model.dto.requestdto.*;
import com.eshop.Eshop.model.dto.responsedto.JwtRefreshResponseDTO;
import com.eshop.Eshop.model.dto.responsedto.UserLoginResponseDTO;
import com.eshop.Eshop.model.dto.responsedto.UserSignUpResponseDTO;
import com.eshop.Eshop.service.AuthServiceImp;
import com.eshop.Eshop.service.UserServiceImp;
import com.eshop.Eshop.service.helper.RedisService;
import com.eshop.Eshop.util.JwtService;
import com.eshop.Eshop.util.OtpService;
import com.eshop.Eshop.util.RefreshTokenService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/auth")
@Validated
public class AuthController {

    private final AuthServiceImp authService;
    
    public AuthController( AuthServiceImp authServiceImp, JwtService jwtService,
            RefreshTokenService refreshTokenService,UserServiceImp userServiceImp,
            OtpService otpService, RedisService redisService) {

        this.authService = authServiceImp;
    }


    /**
     * After mobile number verification using OTP, users can sign up.
     *
     * @param requestDTO UserSignUpRequestDTO containing username, mobile number, and password.
     * @return ResponseEntity with UserSignUpResponseDTO containing user details.
     */
    @PostMapping(value = "/signup")
    public ResponseEntity<UserSignUpResponseDTO> doSignUp(@Valid @RequestBody UserSignUpRequestDTO requestDTO) {
        UserSignUpResponseDTO responseDTO = authService.registerNewUser(requestDTO);
        return ResponseEntity.ok(responseDTO);
    }


    /**
     * Registers a new admin user after verifying their mobile number via OTP.
     *
     * @param requestDTO Admin signup details.
     * @return ResponseEntity with admin details or an error message.
     */
    @PostMapping("/admin-signup")
    public ResponseEntity<UserSignUpResponseDTO> doAdminSingUp(@Valid @RequestBody UserSignUpRequestDTO requestDTO) {
        UserSignUpResponseDTO responseDTO = authService.registerNewUserAdmin(requestDTO, "ADMIN");
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    /**
     * Accepts a mobile number or email and generates an OTP, then sends it to the user.
     *
     * @param requestOtpDTO The DTO containing either mobile number or email.
     * @return ResponseEntity with a success message.
     */
    @PostMapping(value = "/generate-otp")
    public ResponseEntity<DevOtpDTO> generateOtp(@Valid @RequestBody SignupRequestOtpDTO requestOtpDTO) {

        DevOtpDTO devOtp = authService.generateOTP(requestOtpDTO);
        return ResponseEntity.ok(devOtp);
    }

    /**
     * Accepts a new unique mobile number or email, generates an OTP, and sends it to the user.
     * Ensures that the provided mobile number or email has not been used before.
     *
     * @param requestOtpDTO The DTO containing either a new mobile number or email.
     * @return ResponseEntity with a success message if the OTP is sent successfully.
     */
    @PostMapping(value = "/generate-otp/unique")
    public ResponseEntity<DevOtpDTO> generateOtpForUniqueUser(@Valid @RequestBody SignupRequestOtpDTO requestOtpDTO) {

        DevOtpDTO devOtp = authService.generateOtpForUniqueIdentity(requestOtpDTO);
        return ResponseEntity.ok(devOtp);
    }

    /**
     * Verifies the OTP for a given mobile number and marks it as verified if valid.
     *
     * @param requestDTO The DTO containing the mobile number and OTP for verification.
     * @return ResponseEntity with a success message if the OTP is valid.
     * @throws InvalidOTPException if the provided OTP is incorrect.
     */
    @PostMapping(value = "/verify-otp")
    public ResponseEntity<String> verifyOtpMobileNo(@Valid @RequestBody SignupRequestOtpVerificationDTO requestDTO) {

        authService.authenticateOtpForMobile(requestDTO);
        return ResponseEntity.ok("Valid OTP, mobile number marked as verified.");
    }


    /**
     * Authenticates a user using their mobile number or email and password.
     * Returns a JWT and refresh token upon successful login.
     *
     * @param requestDTO User login request containing mobile number/email and password.
     * @return ResponseEntity with JWT, refresh token, and expiration time, or an error message.
     */
    @PostMapping("/login")
    public ResponseEntity<UserLoginResponseDTO> doLogin(@Valid @RequestBody UserLoginRequestDTO requestDTO) {

        UserLoginResponseDTO response = authService.handleLogin(requestDTO);
        return ResponseEntity.ok(response);
    }

    /**
     * Handles user login via OTP.
     * Accepts an email or mobile number and sends an OTP if the user exists.
     *
     * @param requestDTO The request containing the user's email or mobile number.
     * @return ResponseEntity indicating the OTP request status.
     */
    @PostMapping(value = "/login-otp/request")
    public ResponseEntity<DevOtpDTO> doLoginByOtp(@Valid @RequestBody SignupRequestOtpDTO requestDTO) {

        DevOtpDTO devOtp = authService.handleSendOTPForLogin(requestDTO);
        return ResponseEntity.ok(devOtp);
    }

    /**
     * Verifies the OTP and logs in the user.
     *
     * @param requestDTO The request containing the OTP along with email or mobile number.
     * @return ResponseEntity containing the user login response DTO.
     */
    @PostMapping(value = "/login-verify")
    public ResponseEntity<UserLoginResponseDTO> verifyByOtpAndLogin(@Valid @RequestBody OTPVerifyRequestDTO requestDTO) {

        UserLoginResponseDTO responseDTO = authService.handleLoginUsingOTP(requestDTO);
        return ResponseEntity.ok(responseDTO);
    }

    /**
     * Initiates a forgot password request by sending an OTP to the user's registered email or mobile number.
     *
     * @param requestDTO Contains the email or mobile number of the user.
     * @return ResponseEntity with a success message if OTP is sent.
     */
    @PostMapping(value = "/forget-password/request")
    public ResponseEntity<String> forgetPasswordRequest(@Valid @RequestBody MobileOrEmailRequestDTO requestDTO) {

        authService.handleForgetPassRequest(requestDTO);
        return ResponseEntity.ok("OTP sent successfully.");
    }

    /**
     * Updates the user's password using an OTP (One-Time Password).
     * This method validates the OTP and updates the password securely.
     *
     * @param updatePasswordVaiOtpDto Contains the OTP and new password.
     * @return ResponseEntity with a success message if the password is updated successfully.
     */
    @PutMapping(value = "/set-password-otp")
    public ResponseEntity<String> updatePasswordVaiOtp(@Valid @RequestBody UpdatePasswordVaiOtp updatePasswordVaiOtpDto) {

        authService.handleUpdatePasswordVaiOtp(updatePasswordVaiOtpDto);
        return ResponseEntity.ok("Password update successful");
    }

    /**
     * REST API endpoint to refresh an access token using a valid refresh token.
     *
     * Possible Responses:
     * - **200 OK**: Successfully generated a new access token and refresh token.
     * - **400 BAD REQUEST**: If the provided refresh token is invalid or expired. ({@link InvalidJwtTokenException})
     * - **401 UNAUTHORIZED**: If authentication fails due to an invalid user. ({@link AuthenticationException})
     * - **500 INTERNAL SERVER ERROR**: If an unexpected error occurs.
     *
     * @param requestDTO The request body containing the refresh token.
     * @return {@code ResponseEntity<JwtRefreshResponseDTO>} with the new access token and refresh token.
     */
    @GetMapping("/refresh")
    public ResponseEntity<?> doRefresh(@Valid @RequestBody JwtRefreshRequestDTO requestDTO) {

        JwtRefreshResponseDTO responseDTO = authService.UseRefreshToken(requestDTO);
        return ResponseEntity.ok(responseDTO);
    }
}
