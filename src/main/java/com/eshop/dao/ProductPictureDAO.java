package com.eshop.dao;

import com.eshop.entities.ProductPicture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductPictureDAO extends JpaRepository<ProductPicture, Integer> {
    //Basic CRUD auto-implemented
    ProductPicture findByName(String name);
}
