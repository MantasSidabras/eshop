package com.eshop.services;

import com.eshop.dao.ProductDao;
import com.eshop.entities.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;

/**
 * Created by Domas on 2018-03-19.
 */
@Service
public class ProductService {
    @Autowired
    private ProductDao productDao;

    public Collection<Product> getItems() {
        return this.productDao.getItems();
    }

    public Product getItemById(int id) {
        return this.productDao.getItemById(id);
    }
}
