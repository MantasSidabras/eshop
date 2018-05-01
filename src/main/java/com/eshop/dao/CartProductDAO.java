package com.eshop.dao;

import com.eshop.entities.CartProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartProductDAO extends JpaRepository<CartProduct, Integer> {
    //Basic CRUD auto-implemented
}
