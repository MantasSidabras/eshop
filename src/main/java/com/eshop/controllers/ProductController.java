package com.eshop.controllers;

import com.eshop.entities.Product;
import com.eshop.entities.ProductImage;
import com.eshop.services.ProductImageService;
import com.eshop.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/product")
@CrossOrigin("http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductImageService productImageService;


    //check  product is being created
    @PostMapping
    @ResponseBody
    @ResponseStatus(HttpStatus.CREATED)
    public Product createProduct(@RequestBody Product product) {
        product.setDateCreated(LocalDateTime.now());
        return this.productService.create(product);
    }

    //check  product is being get all
    @GetMapping
    @ResponseBody
    public List<Product> getAllProducts() {
        return productService.findAll();
    }


    //check  product is being get by id
    @GetMapping("/{id}")
    @ResponseBody
    public ResponseEntity<Product> getProductById(@PathVariable("id") Integer id) {
        Product product = productService.findById(id);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } else {
            return ResponseEntity.ok(product);
        }
    }


    //check  product is being updated
    @PutMapping
    @ResponseBody
    public Product updateProduct(@RequestBody Product product) {
        return this.productService.update(product);
    }


    //check  product is being created
    @DeleteMapping("/{id}")
    @ResponseBody
    public Map<String, String> deleteProduct(@PathVariable("id") Integer id) {
        Map<String, String> res = new HashMap<>();
        this.productService.deleteById(id);
        res.put("message", "success");
        return res;
    }

    //check  images is being created

    @PostMapping("/{id}/images")
    @ResponseBody
    public Map<String, String> setImages(@PathVariable("id") Integer id, @RequestParam("file") MultipartFile[] images) {
        Map<String, String> res = new HashMap<>();

        for (MultipartFile image : images) {
            try {
                InputStream targetStream = image.getInputStream();
                byte[] buffer = new byte[targetStream.available()];
                targetStream.read(buffer);
                targetStream.close();

                ProductImage pp = new ProductImage();
                Product product = productService.findById(id);
                pp.setProduct(product);
                pp.setData(buffer);
                pp.setName(image.getOriginalFilename());

                productImageService.create(pp);
            } catch (Exception e) {
                System.out.println("ERROR input stream" + e.toString());
                res.put("message", "failure");
                return res;
            }
        }

        res.put("message", "success");
        return res;
    }
}