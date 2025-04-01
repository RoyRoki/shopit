package com.eshop.Eshop.repository;

import com.eshop.Eshop.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    Boolean existsByEmail(String email);
    Boolean existsByMobileNo(String mobileNo);
    Optional<User> findByEmail(String email);
    Optional<User> findByMobileNo(String mobileNo);
}
