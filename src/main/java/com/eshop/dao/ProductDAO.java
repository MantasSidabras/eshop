package com.eshop.dao;

import com.eshop.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductDAO extends JpaRepository<Product, Integer> {
    //Basic CRUD auto-implemented
}
