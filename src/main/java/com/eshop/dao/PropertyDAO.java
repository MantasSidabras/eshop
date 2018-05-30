package com.eshop.dao;

import com.eshop.entities.ProductImage;
import com.eshop.entities.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyDAO extends JpaRepository<Property, Integer> {

    List<Property> findAllByProductId(Integer id);

    @Override
    void deleteById(Integer integer);
}