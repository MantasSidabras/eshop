package com.eshop.services;

import com.eshop.dao.ProductImageDAO;
import com.eshop.entities.ProductImage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductImageService {

    @Autowired
    private ProductImageDAO productImageDAO;

    public ProductImage create(ProductImage pp){
        return productImageDAO.save(pp);
    }

    public ProductImage findById(Integer id) {
        return productImageDAO.findById(id).orElse(null);
    }

    public ProductImage update(ProductImage productImage){
        return productImageDAO.save(productImage);
    }

    public void deleteById(Integer id){
        productImageDAO.deleteById(id);
    }

    public ProductImage findByName(String name) {
        return productImageDAO.findByName(name);
    }
}
