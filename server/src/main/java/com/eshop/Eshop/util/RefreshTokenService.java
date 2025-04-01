package com.eshop.Eshop.util;

import com.eshop.Eshop.model.dto.UserDetailsImp;
import com.eshop.Eshop.model.RefreshToken;
import com.eshop.Eshop.model.User;
import com.eshop.Eshop.repository.RefreshTokenRepo;
import com.eshop.Eshop.service.UserServiceImp;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class RefreshTokenService {

    @Value("${security.jwt.refresh-token.expiration-time}")
    private long refreshTokenExpiration;

    @Value("${security.jwt.refresh-token.secret-key}")
    private String secretKey;

    @Autowired
    private RefreshTokenRepo refreshTokenRepo;

    @Autowired
    private UserServiceImp userService;

    public String generateRefreshToken() {
        String refreshToken;
        do {
            refreshToken = buildToken(refreshTokenExpiration);
        } while (refreshTokenRepo.existsByRefreshToken(refreshToken));
        return refreshToken;
    }

    private String buildToken(long expiration) {
        return
                Jwts.builder()
                        .setSubject("RefreshToken")
                        .setIssuedAt(new Date(System.currentTimeMillis()))
                        .setExpiration(new Date(System.currentTimeMillis() + expiration))
                        .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                        .compact();
    }

    public boolean isValid(String refreshToken) {
        return isExist(refreshToken) && !isTokenExpired(refreshToken);
    }

    public boolean isExist(String refreshToken) {
        try {
            return refreshTokenRepo.existsByRefreshToken(refreshToken);
        } catch (Exception e) {
            return false;
        }
    }
    public boolean isTokenExpired(String token) {
        try {
            long expireIn = refreshTokenRepo.findByRefreshToken(token)
                    .orElseThrow().getExpiresIn();
            return new Date(expireIn).before(new Date());
        } catch (Exception e) {
            return true;
        }

    }

    public long getUserIdByRefreshToken(String refreshToken) {
        User user = refreshTokenRepo.findByRefreshToken(refreshToken)
                        .orElseThrow().getUser();
        return user.getId();
    }

    public RefreshToken saveRefreshToken(UserDetailsImp userDetails, String refreshToken) {
        try {
            User user = userService.getUserById(Long.parseLong(userDetails.getUserIdAsName()));
            RefreshToken refreshTokenModel = RefreshToken.builder()
                    .refreshToken(refreshToken)
                    .expiresIn(System.currentTimeMillis() + refreshTokenExpiration)
                    .user(user)
                    .build();

            return refreshTokenRepo.save(refreshTokenModel);
        } catch (Exception e) {
            return null;
        }
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public void expireTokenNow(String refreshToken) {
        RefreshToken token = refreshTokenRepo.findByRefreshToken(refreshToken)
                .orElseThrow();
        token.setExpiresIn(System.currentTimeMillis());
        refreshTokenRepo.save(token);
    }
}
