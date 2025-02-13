package com.eshop.Eshop.util;

import com.eshop.Eshop.service.MessageServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import org.springframework.data.redis.core.RedisTemplate;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    @Value("${security.otp.expiration-time}")
    private long otpExpiration;

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private MessageServiceImp messageService;

    // Generate OTP
    public String generateOTP() {
        return String.valueOf(ThreadLocalRandom.current().nextInt(1000, 10000));
    }

    // Hash OTP
    public String hashMe(String val) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] hashByte = digest.digest(val.getBytes());

            // convert the byte array to a hexadecimal string
            StringBuilder hexString = new StringBuilder();

            for(byte b : hashByte) {
                String hex = Integer.toHexString(0xff & b);
                if(hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }

            return hexString.toString();

        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }


    // Store OTP with expiration
    public void saveOTP(String key, String otp) {
        redisTemplate.opsForValue().set(key, otp, otpExpiration, TimeUnit.MILLISECONDS);
    }

    // Retrieve OTP
    public String getOTP(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    // Delete OTP
    public void deleteOTP(String key) {
        redisTemplate.delete(key);
    }

    // Send otp to mobile number
    public void sentOtpToMobile(String mobileNo, String otp) {
        String message = "Hey "+mobileNo+" \nOtp receive from eshop \notp: "+otp+"\n don't shear otp to anyone\nThanks for login";
        messageService.sentMessageToMobile(mobileNo, message);
    }

    // Send otp to email
    public void sentOtpToEmail(String email, String otp) {
        String message = "Hey "+email+" \nOtp receive from eshop \notp: "+otp+"\n don't shear otp to anyone\nThanks for login";
        messageService.sentMessageToEmail(email, message);
    }

    /**
     * Generates, hashes, sends, and saves OTP for a given mobile number or email.
     * @param identifier Either a mobile number or an email.
     * @param isMobile True if identifier is a mobile number, False if it is an email.
     */
    public void saveAndSendOTP(String identifier, boolean isMobileNO) {
        String otp = generateOTP();        // Generate OTP
        String hashOtp = hashMe(otp);      // Hash OTP

        if(isMobileNO) {
            sentOtpToMobile(identifier, otp);
        } else {
            sentOtpToEmail(identifier, otp);
        }

        saveOTP(identifier, hashOtp);   // Save OTP for verification
    }
}
