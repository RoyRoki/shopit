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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthServiceImp authService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private UserServiceImp userService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private RedisService redisService;

    /*
    *  After mobile No verified vai OTP, then signup
    * */
    @PostMapping("/signup")
    public ResponseEntity<?> doSingUp(@RequestBody UserSignUpRequestDTO requestDTO) {
        try {
            UserSignUpResponseDTO responseDTO = authService.registerNewUser(requestDTO);
            System.out.println("Hi is this null! "+responseDTO.getUserName()); // @CleanUp
            if(responseDTO.getUserId() != null) {
                return new ResponseEntity<>(responseDTO, HttpStatus.OK);
            }

            return new ResponseEntity<>("Email / MobileNo already exists", HttpStatus.FORBIDDEN);

        } catch (Exception e) {
            return new ResponseEntity<>("MobileNo not Verified! verify mobileNo /verify-otp", HttpStatus.BAD_REQUEST);
        }
    }

    /*
     *  After mobile No verified vai OTP, then signup
     * */
    @PostMapping("/admin-signup")
    public ResponseEntity<?> doAdminSingUp(@RequestBody UserSignUpRequestDTO requestDTO) {
        try {
            UserSignUpResponseDTO responseDTO = authService.registerNewUserAdmin(requestDTO, "ADMIN");
            if(responseDTO != null)
                return new ResponseEntity<>(responseDTO, HttpStatus.OK);

            return new ResponseEntity<>("Email / MobileNo already exists", HttpStatus.FORBIDDEN);

        } catch (Exception e) {
            return new ResponseEntity<>("MobileNo not Verified! verify mobileNo /verify-otp", HttpStatus.BAD_REQUEST);
        }

    }

    // Accept MobileNo and generate an otp and sent it.
    @PostMapping(value = "/generate-otp")
    public ResponseEntity<?> generateOtp(@RequestBody SignupRequestOtpDTO requestOtpDTO) {
        if(requestOtpDTO.getMobileNo() != null) {
            String otp = otpService.generateOTP();
            String hashOtp = otpService.hashMe(otp);

            otpService.sentOtpToMobile(requestOtpDTO.getMobileNo(), otp);
            otpService.saveOTP(requestOtpDTO.getMobileNo(), hashOtp);

            return ResponseEntity.status(HttpStatus.OK).body("Otp sent to "+requestOtpDTO.getMobileNo()+"/n Otp: {"+otp+"}");
        } else if(requestOtpDTO.getEmail() != null) {
            String otp = otpService.generateOTP();
            String hashOtp = otpService.hashMe(otp);

            otpService.sentOtpToEmail(requestOtpDTO.getEmail(), otp);
            otpService.saveOTP(requestOtpDTO.getEmail(), hashOtp);
            return ResponseEntity.status(HttpStatus.OK).body("Otp sent to "+requestOtpDTO.getEmail()+"/n Otp: {"+otp+"}");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Mobile No!");
    }

     /*
     * Accept MobileNo and OTP and verify the OTP
     * And Mark the mobileNo as Verified
     */
    @PostMapping(value = "verify-otp")
    public ResponseEntity<?> verifyOtpMobileNo(@RequestBody SignupRequestOtpVerificationDTO requestDTO) {
        try {
            String hashOTP = otpService.hashMe(requestDTO.getOtp());
            String savedHashOtp = otpService.getOTP(requestDTO.getMobileNo());

            if(hashOTP.equals(savedHashOtp)) {
                redisService.savedVerifiedMobileNo(requestDTO.getMobileNo());
                return ResponseEntity.status(HttpStatus.OK).body("Valid OTP, Mark the mobileNo verified");
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("OTP invalid!");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error during verify the otp");
        }
    }

    // Login using  mobileNo/email and password
    @PostMapping("/login")
    public ResponseEntity<?> doLogin(@RequestBody UserLoginRequestDTO requestDTO) {
        try {
            UserDetailsImp authenticatedUser = authService.VerifyWithPassAndGetUserDetailsImp(requestDTO);

            if(authenticatedUser != null) {
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
    public ResponseEntity<?> doLoginByOtp(@RequestParam(required = false) String mobileNo, @RequestParam(required = false) String email) {
        if(mobileNo == null && email == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Mobile and Email both are null -error");
        }
        try {
            if(userService.isUserExist(email, mobileNo)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email/Mobile not exist!");
            }
            String key = email != null ? email : mobileNo;

                 String otp = otpService.generateOTP();
                 String hashOtp = otpService.hashMe(otp);

                 otpService.saveOTP(key, hashOtp);

            if(email != null) {
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
        UserDetailsImp authenticatedUser = authService.getUserDetailsImp(requestDTO);

        if(authenticatedUser != null) {
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
        return new ResponseEntity<>("OTP not valid", HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/refresh")
    public ResponseEntity<?> doRefresh(@RequestBody JwtRefreshRequestDTO requestDTO){

        if(refreshTokenService.isValid(requestDTO.getRefreshToken())) {
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
