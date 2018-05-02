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

    public ProductPicture create(Product product, String url){
        ProductPicture newUser = new ProductPicture(product, url);
        return productPictureDAO.save(newUser);
    }

    public ProductPicture update(ProductPicture productPicture){
        return productPictureDAO.save(productPicture);
    }

    public void delete(ProductPicture order){
        productPictureDAO.delete(order);
    }
}
