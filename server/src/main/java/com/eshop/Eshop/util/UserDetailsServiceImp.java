package com.eshop.Eshop.util;

import com.eshop.Eshop.model.dto.UserDetailsImp;
import com.eshop.Eshop.model.User;
import com.eshop.Eshop.service.UserServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImp implements UserDetailsService {

    @Autowired
    private UserServiceImp userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.getUserById(Long.parseLong(username));
        return UserDetailsImp
                .builder()
                .userIdAsName(Long.toString(user.getId()))
                .password(user.getPassword())
                .roles(user.getRoles())
                .build();
    }
}
