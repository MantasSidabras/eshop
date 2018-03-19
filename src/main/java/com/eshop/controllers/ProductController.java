package com.eshop.controllers;

import com.eshop.entities.Product;
import com.eshop.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Collection;

@RestController
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping("/api/products")
    public Collection<Product> getItems() {
        return productService.getItems();
    }

    @GetMapping("/api/products/{id}")
    public Product getItemById(@PathVariable("id") int id) {
        return productService.getItemById(id);
    }
}
