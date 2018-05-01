package com.eshop.services;

import com.eshop.repositories.ProductRepository;
import com.eshop.entities.ProductOLD;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;

/**
 * Created by Domas on 2018-03-19.
 */
@Service
public class ProductOLDService {
    @Autowired
    private ProductRepository productRepository;

    public ProductOLD save(ProductOLD productOLD) {
        return this.productRepository.save(productOLD);
    }
    public Collection<ProductOLD> getAll() {
        return this.productRepository.getAll();
    }

    public ProductOLD getById(int id) {
        return this.productRepository.getById(id);
    }
}
