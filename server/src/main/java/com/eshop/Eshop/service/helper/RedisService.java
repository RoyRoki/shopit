package com.eshop.Eshop.service.helper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.eshop.Eshop.exception.custom.InvalidMobileNumberException;

import java.util.Objects;
import java.util.concurrent.TimeUnit;

@Service
public class RedisService {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Value("${security.verified-mobile-no.expiration-time}")
    private long verifiedMobileNoExpiration;

    public void savedVerifiedMobileNo(String mobileNo) {
        redisTemplate.opsForValue().set(mobileNo+":V", "true", verifiedMobileNoExpiration, TimeUnit.MILLISECONDS);
    }

    public boolean isMobileNoVerified(String mobileNo) {
        String value = redisTemplate.opsForValue().get(mobileNo + ":V");
        return Objects.nonNull(value); // Returns true if value exists
    }

    public void put(String key, String value, long timeMILLIS) {
        redisTemplate.opsForValue().set(key, value, timeMILLIS, TimeUnit.MILLISECONDS);
    }

    public String get(String key) {
        return redisTemplate.opsForValue().get(key);
    }
}
