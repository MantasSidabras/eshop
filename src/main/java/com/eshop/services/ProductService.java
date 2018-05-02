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

    public Product createProduct(String name, String description, BigDecimal price, Integer quantity){
        Product newProduct = new Product(name,description,price,quantity);
        return productDAO.save(newProduct);
    }

    public List<Product> getAllUsers(){
        return productDAO.findAll();
    }
}
