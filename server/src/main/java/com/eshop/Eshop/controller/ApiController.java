package com.eshop.Eshop.controller;

import com.eshop.Eshop.model.Role;
import com.eshop.Eshop.service.UserServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/api")
public class ApiController {

    @Autowired
    private UserServiceImp userService;

    @GetMapping(value = "/role")
    public String getRole() {
        try {
            List<Role> roles = userService.currentUser().getRoles();
            boolean admin = false, user = false;
            
            for(Role role : roles) {
                if(role.getRoleName().equals("ADMIN")) admin = true;
                else if(role.getRoleName().equals("USER")) user = true;
            }

            if(admin) return "ADMIN";
            else if(user) return "USER";
            else return null;

        } catch (Exception e) {
            return null;
        }
    }
}
