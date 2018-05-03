package com.eshop.dao;

import com.eshop.entities.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductImageDAO extends JpaRepository<ProductImage, Integer> {
    //Basic CRUD auto-implemented
    ProductImage findByName(String name);
}
