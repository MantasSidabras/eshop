package com.eshop.services;

import com.eshop.dao.ProductDAO;
import com.eshop.entities.Product;
import com.eshop.exceptions.ProductNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


@Service
public class ProductService {

    @Autowired
    private ProductDAO productDAO;

    public Product create(Product product){
        product.setDateCreated(LocalDateTime.now());
        return productDAO.save(product);
    }

    public List<Product> findAll(){
        return productDAO.findAll();
    }

    public Product findById(Integer id) throws ProductNotFoundException {
        Product product = productDAO.findById(id).orElse(null);
        if(product == null){
            throw new ProductNotFoundException();
        }
        else{
            return product;
        }
    }

    public Product update(Product product) {
        return productDAO.save(product);
    }

    public void deleteById(Integer id) throws ProductNotFoundException{
        //productDAO.deleteById(id);
        try{
            Product delProduct = findById(id);
            delProduct.setDeleted(true);
            productDAO.save(delProduct);

        }
        catch(ProductNotFoundException e){
            throw e;
        }

    }
}
