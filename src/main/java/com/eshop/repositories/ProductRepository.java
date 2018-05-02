package com.eshop.repositories;

import com.eshop.entities.ProductOLD;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Domas on 2018-03-19.
 */
@Repository
public class ProductRepository {
    private Map<Integer, ProductOLD> products = new HashMap<Integer, ProductOLD>(){{
        put(1, new ProductOLD(1, "Laptop", "Top notch laptop", new BigDecimal(500.40), 7));
        put(2, new ProductOLD(2, "Phone", "Top notch phone", new BigDecimal(350.99), 2));
        put(3, new ProductOLD(3, "Jacket", "Top notch jacket", new BigDecimal(54.95), 3));
        put(4, new ProductOLD(4, "CPU", "Top notch cpu", new BigDecimal(169.70), 4));
        put(5, new ProductOLD(5, "Hat", "Top notch hat", new BigDecimal(14.95), 10));
        put(6, new ProductOLD(6, "Headphones","Top notch headphones", new BigDecimal(84.99), 5));
    }};


    public ProductOLD save(ProductOLD productOLD) {
        productOLD.setId(this.getSize() + 1);
        this.products.put(this.getSize() + 1, productOLD);
        return productOLD;
    }

    public int getSize() { return this.products.size(); }

    public Collection<ProductOLD> getAll() {
        return this.products.values();
    }

    public ProductOLD getById(int id) {
        return this.products.get(id);
    }
}
