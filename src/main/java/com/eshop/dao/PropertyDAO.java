package com.eshop.dao;

import com.eshop.entities.ProductImage;
import com.eshop.entities.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyDAO extends JpaRepository<Property, Integer> {
}