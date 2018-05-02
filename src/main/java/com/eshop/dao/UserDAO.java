package com.eshop.dao;

import com.eshop.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserDAO extends JpaRepository<User, Integer> {
    //Basic CRUD auto-implemented
    User findByEmail(String email);
}
