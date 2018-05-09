package com.eshop.dao;

import com.eshop.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductDAO extends JpaRepository<Product, Integer> {
    //Basic CRUD auto-implemented

    List<Product> findByName(String name);
}
