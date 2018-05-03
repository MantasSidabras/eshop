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

    public List<Product> findAll(){
        return productDAO.findAll();
    }

    public Product findById(Integer id) {
        return productDAO.findById(id).orElse(null);
    }

    public Product update(Product product) {
        return productDAO.save(product);
    }

    public void deleteById(Integer id) {
        productDAO.deleteById(id);
    }
}
