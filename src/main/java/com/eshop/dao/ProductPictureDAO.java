package com.eshop.dao;

import com.eshop.entities.ProductPicture;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductPictureDAO extends JpaRepository<ProductPicture, Integer> {
    //Basic CRUD auto-implemented
}
