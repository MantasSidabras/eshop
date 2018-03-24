package com.eshop.controllers;

import com.eshop.entities.Product;
import com.eshop.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.Collection;

@Controller
@RequestMapping(value = "/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping("/products")
    @ResponseBody
    public Collection<Product> getItems() {
        return productService.getItems();
    }

    @GetMapping("/products/{id}")
    @ResponseBody
    public Product getItemById(@PathVariable("id") int id) {
        return productService.getItemById(id);
    }
}