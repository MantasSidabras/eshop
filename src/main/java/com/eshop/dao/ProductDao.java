package com.eshop.dao;

import com.eshop.entities.Product;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Domas on 2018-03-19.
 */
@Repository
public class ProductDao {
    private Map<Integer, Product> products = new HashMap<Integer, Product>(){{
        put(1, new Product(1, "Laptop", 500.40));
        put(2, new Product(2, "Phone", 350.99));
        put(3, new Product(3, "Jacket", 54.95));
        put(4, new Product(4, "CPU", 169.70));
        put(5, new Product(5, "Hat", 14.95));
        put(6, new Product(6, "Headphones", 84.99));
    }};

    public Collection<Product> getItems() {
        return this.products.values();
    }

    public Product getItemById(int id) {
        return this.products.get(id);
    }
}
