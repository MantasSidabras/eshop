package com.eshop.services;

import com.eshop.dao.ProductDAO;
import com.eshop.entities.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductDAO productDAO;

    public Product create(Product product){
        return productDAO.save(product);
    }

    public List<Product> getAllProducts(){
        return productDAO.findAll();
    }
}
