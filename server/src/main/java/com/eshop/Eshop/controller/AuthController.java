package com.eshop.Eshop.controller;

import com.eshop.Eshop.model.dto.*;
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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/auth")
@Validated
@Tag(name = "Authentication", description = "APIs for user/Admin authentication and signup")
public class AuthController {

    private AuthServiceImp authService;
    private JwtService jwtService;
    private RefreshTokenService refreshTokenService;
    private UserServiceImp userService;
    private OtpService otpService;
    public AuthController( AuthServiceImp authServiceImp, JwtService jwtService,
            RefreshTokenService refreshTokenService,UserServiceImp userServiceImp,
            OtpService otpService, RedisService redisService) {

        this.authService = authServiceImp;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.userService = userServiceImp;
        this.otpService = otpService;
    }


    /**
     * After mobile number verification using OTP, users can sign up.
     *
     * @param requestDTO UserSignUpRequestDTO containing username, mobile number, and password.
     * @return ResponseEntity with UserSignUpResponseDTO containing user details.
     */
    @PostMapping(value = "/signup")
    @Operation(
        summary = "User Signup",
        description = "Registers a new user after verifying the mobile number with OTP.  **This is a public API and does not require authentication.**",
        responses = {
            @ApiResponse(responseCode = "200", description = "User registered successfully",
                         content = @Content(schema = @Schema(implementation = UserSignUpResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Validation error"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    public ResponseEntity<?> doSignUp(@Valid @RequestBody UserSignUpRequestDTO requestDTO) {
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
    @Operation(
        summary = "Admin Signup",
        description = "Registers a new admin user after verifying their mobile number via OTP.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Admin registered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Registration failed (e.g., email/mobile exists)"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    public ResponseEntity<?> doAdminSingUp(@Valid @RequestBody UserSignUpRequestDTO requestDTO) {
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
    public ResponseEntity<String> generateOtp(@Valid @RequestBody SignupRequestOtpDTO requestOtpDTO) {

        authService.generateOTP(requestOtpDTO);
        return ResponseEntity.ok("OTP sent successfully.");
    }

    /**
     * Accepts a new unique mobile number or email, generates an OTP, and sends it to the user.
     * Ensures that the provided mobile number or email has not been used before.
     *
     * @param requestOtpDTO The DTO containing either a new mobile number or email.
     * @return ResponseEntity with a success message if the OTP is sent successfully.
     */
    @PostMapping(value = "/generate-otp/unique")
    public ResponseEntity<?> generateOtpForUniqueUser(@Valid @RequestBody SignupRequestOtpDTO requestOtpDTO) {

        authService.generateOtpForUniqueIdentity(requestOtpDTO);
        return ResponseEntity.ok("OTP sent successfully.");
    }

    /**
     * Verifies the OTP for a given mobile number and marks it as verified if valid.
     *
     * @param requestDTO The DTO containing the mobile number and OTP for verification.
     * @return ResponseEntity with a success message if the OTP is valid.
     * @throws InvalidOTPException if the provided OTP is incorrect.
     */
    @PostMapping(value = "verify-otp")
    public ResponseEntity<String> verifyOtpMobileNo(@Valid @RequestBody SignupRequestOtpVerificationDTO requestDTO) {

        authService.authenticateOtpForMobile(requestDTO);
        return ResponseEntity.ok("Valid OTP, mobile number marked as verified.");
    }


    // Login using mobileNo/email and password
    @PostMapping("/login")
    public ResponseEntity<?> doLogin(@RequestBody UserLoginRequestDTO requestDTO) {
        try {
            UserDetailsImp authenticatedUser = authService.VerifyWithPassAndGetUserDetailsImp(requestDTO);

            if (authenticatedUser != null) {
                String jwt = jwtService.generateToken(authenticatedUser);

                String refreshToken = refreshTokenService.generateRefreshToken();
                refreshTokenService.saveRefreshToken(authenticatedUser, refreshToken);

                UserLoginResponseDTO responseDTO = UserLoginResponseDTO.builder()
                        .id(authenticatedUser.getUserIdAsName())
                        .jwt(jwt)
                        .refreshToken(refreshToken)
                        .expiresIn(jwtService.getExpirationTime())
                        .build();
                return new ResponseEntity<>(responseDTO, HttpStatus.OK);
            }
            return new ResponseEntity<>("Email / MobileNo not valid", HttpStatus.UNAUTHORIZED);

        } catch (Exception e) {
            return new ResponseEntity<>("Error during authenticate", HttpStatus.BAD_REQUEST);
        }
    }

    // Login using mobileNo/email and OTP
    @PostMapping(value = "/login-otp")
    public ResponseEntity<?> doLoginByOtp(@RequestParam(required = false) String mobileNo,
            @RequestParam(required = false) String email) {
        if (mobileNo == null && email == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Mobile and Email both are null -error");
        }
        try {
            if (userService.isUserExist(email, mobileNo)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email/Mobile not exist!");
            }
            String key = email != null ? email : mobileNo;

            String otp = otpService.generateOTP();
            String hashOtp = otpService.hashMe(otp);

            otpService.saveOTP(key, hashOtp);

            if (email != null) {
                otpService.sentOtpToEmail(email, otp);
            } else {
                otpService.sentOtpToMobile(mobileNo, otp);
            }
            return ResponseEntity.status(HttpStatus.OK).body("OTP sent, use the otp to login");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error during login using otp");
        }
    }

    // Verify by otp and login
    @PostMapping(value = "/login-verify")
    private ResponseEntity<?> verifyByOtpAndLogin(@RequestBody OTPVerifyRequestDTO requestDTO) {
        try {
            UserDetailsImp authenticatedUser = authService.getUserDetailsImp(requestDTO);

            if (authenticatedUser != null) {
                String jwt = jwtService.generateToken(authenticatedUser);

                String refreshToken = refreshTokenService.generateRefreshToken();
                refreshTokenService.saveRefreshToken(authenticatedUser, refreshToken);

                UserLoginResponseDTO responseDTO = UserLoginResponseDTO.builder()
                        .id(authenticatedUser.getUserIdAsName())
                        .jwt(jwt)
                        .refreshToken(refreshToken)
                        .expiresIn(jwtService.getExpirationTime())
                        .build();
                return new ResponseEntity<>(responseDTO, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("OTP not valid", HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error during login vai otp", HttpStatus.BAD_REQUEST);
        }

    }

    @PutMapping(value = "/update-password")
    public ResponseEntity<?> updatePasswordByOldPass(@RequestBody UpdatePasswordDTO passwordDTO) {
        try {
            authService.handleUpdatePassword(passwordDTO);
            return ResponseEntity.ok("Successfully password updated");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update password");
        }
    }

    @PostMapping(value = "/forget-password-request")
    public ResponseEntity<?> forgetPasswordRequest(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String mobile) {
        if (email == null && mobile == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Please provide email/mobile");
        }
        if (userService.isUserExist(email, mobile)) {
            try {
                if (email != null) {
                    String otp = otpService.generateOTP();
                    String hash = otpService.hashMe(otp);

                    otpService.sentOtpToEmail(email, otp);
                    otpService.saveOTP(email + ":fp:", hash);

                    return ResponseEntity.ok("OTP sent to your email " + email);
                } else {
                    String otp = otpService.generateOTP();
                    String hash = otpService.hashMe(otp);

                    otpService.sentOtpToMobile(mobile, otp);
                    otpService.saveOTP(mobile + ":fp:", hash);

                    return ResponseEntity.ok("OTP sent to your phone " + mobile);
                }
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Request failed!");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No account found with this email/mobile");
    }

    @PutMapping(value = "/set-password-otp")
    public ResponseEntity<?> updatePasswordVaiOtp(@RequestBody UpdatePasswordVaiOtp updatePasswordVaiOtpDto) {
        try {
            authService.handleUpdatePasswordVaiOtp(updatePasswordVaiOtpDto);
            return ResponseEntity.ok("Password update successful");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update password!");
        }
    }

    @GetMapping("/refresh")
    public ResponseEntity<?> doRefresh(@RequestBody JwtRefreshRequestDTO requestDTO) {

        if (refreshTokenService.isValid(requestDTO.getRefreshToken())) {
            refreshTokenService.expireTokenNow(requestDTO.getRefreshToken());

            long user_id = refreshTokenService.getUserIdByRefreshToken(requestDTO.getRefreshToken());

            UserDetailsImp authenticatedUser = authService.getUserDetailsImp(userService.getUserById(user_id));
            String jwt = jwtService.generateToken(authenticatedUser);

            String refreshToken = refreshTokenService.generateRefreshToken();
            refreshTokenService.saveRefreshToken(authenticatedUser, refreshToken);

            JwtRefreshResponseDTO responseDTO = JwtRefreshResponseDTO.builder()
                    .jwt(jwt)
                    .refreshToken(refreshToken)
                    .build();
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>("RefreshToken Invalid / login again?", HttpStatus.FORBIDDEN);
    }

}
