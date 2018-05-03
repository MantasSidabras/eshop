package com.eshop.services;

import com.eshop.dao.ProductPictureDAO;
import com.eshop.entities.Product;
import com.eshop.entities.ProductPicture;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductPictureService {

    @Autowired
    private ProductPictureDAO productPictureDAO;

    public ProductPicture create(ProductPicture pp){
        return productPictureDAO.save(pp);
    }

    public ProductPicture update(ProductPicture productPicture){
        return productPictureDAO.save(productPicture);
    }

    public void deleteById(Integer id){
        productPictureDAO.deleteById(id);
    }

    public ProductPicture findByName(String name) {
        return productPictureDAO.findByName(name);
    }
}
