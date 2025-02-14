package com.eshop.Eshop.service.helper;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceHelper {
      
      private final PasswordEncoder passwordEncoder;

      public AuthServiceHelper(PasswordEncoder passwordEncoder) {
            this.passwordEncoder = passwordEncoder;
      }

      public String passwordToHash(String pass) {
            return passwordEncoder.encode(pass);
      }

      public boolean matchRawAndEncoded(String rawPass, String encodedPass ) {
            return passwordEncoder.matches(rawPass, encodedPass);
      }
}
