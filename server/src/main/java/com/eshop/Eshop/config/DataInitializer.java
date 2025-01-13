package com.eshop.Eshop.config;

import com.eshop.Eshop.model.Category;
import com.eshop.Eshop.model.Role;
import com.eshop.Eshop.repository.CategoryRepo;
import com.eshop.Eshop.repository.RoleRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.Arrays;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initializeRoles(RoleRepo roleRepo, CategoryRepo categoryRepo) {
        return args -> {
            if(roleRepo.findByRoleName("USER").isEmpty()) {
                roleRepo.save(new Role("USER"));
            }
            if(roleRepo.findByRoleName("ADMIN").isEmpty()) {
                roleRepo.save(new Role("ADMIN"));
            }

            // Initialize Categories
            if (categoryRepo.findAll().isEmpty()) {
                Category c1 = Category.builder().name("Electronics").build();
                Category c2 = Category.builder().name("Fashion").build();
                Category c3 = Category.builder().name("Home & Kitchen").build();

                categoryRepo.saveAll(Arrays.asList(c1, c2, c3));
            }
        };
    }
}
