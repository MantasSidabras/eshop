package com.eshop.dao;

import com.eshop.entities.CartProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartProductDAO extends JpaRepository<CartProduct, Integer> {
    //Basic CRUD auto-implemented

    List<CartProduct> findByUserId(Integer id);
}
