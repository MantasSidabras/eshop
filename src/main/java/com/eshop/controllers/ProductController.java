package com.eshop.controllers;

import com.eshop.entities.Product;
import com.eshop.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping(value = "/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping(value = "/products", produces = "application/json")
    @ResponseBody
    public Collection<Product> getProducts() {
        return productService.getAll();
    }

    @PostMapping(value = "/products", consumes = "application/json", produces = "application/json")
    @ResponseBody
    @ResponseStatus(HttpStatus.CREATED)
    public Product setProduct(@RequestBody Product product) {
        return this.productService.save(product);
    }

    @PostMapping(value = "/products/{id}/images", consumes = "multipart/form-data", produces = "application/json")
    @ResponseBody
    public Map<String, String> setImages(@RequestParam("file") MultipartFile[] images, @PathVariable("id") int id) {
        Map<String, String> res = new HashMap<>();

        for (int i = 0; i < images.length; i++) {
            System.out.println(String.format("File name %s", images[i].getOriginalFilename()));
            try {
                InputStream targetStream = images[i].getInputStream();
                byte[] buffer = new byte[targetStream.available()];
                targetStream.read(buffer);

                File targetFile = new File(String.format("productImages/%d_%s", id, images[i].getOriginalFilename()));
                OutputStream outStream = new FileOutputStream(targetFile);
                outStream.write(buffer);
            } catch (Exception e) {
                System.out.println("ERROR input stream" + e.toString());
                res.put("message", "failure");
                return res;
            }
        }

        res.put("message", "success");
        return res;
    }

    @GetMapping(value = "/products/{id}", produces = "application/json")
    @ResponseBody
    public Product getProductById(@PathVariable("id") int id) {
        return productService.getById(id);
    }
}