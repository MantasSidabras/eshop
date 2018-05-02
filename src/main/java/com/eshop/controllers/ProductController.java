package com.eshop.controllers;

import com.eshop.entities.Product;
import com.eshop.entities.ProductPicture;
import com.eshop.services.ProductPictureService;
import com.eshop.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(value = "/api/product")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductPictureService productPictureService;

    @GetMapping(produces = "application/json")
    @ResponseBody
    public List<Product> getAllProducts() {
        return productService.getAll();
    }

    @PostMapping(consumes = "application/json", produces = "application/json")
    @ResponseBody
    @ResponseStatus(HttpStatus.CREATED)
    public Product createProduct(@RequestBody Product product) {
        product.setDateCreated(LocalDateTime.now());
        return this.productService.create(product);
    }

    @PostMapping(value = "/{id}/images", consumes = "multipart/form-data", produces = "application/json")
    @ResponseBody
    public Map<String, String> setImages(@RequestParam("file") MultipartFile[] images, @PathVariable("id") Integer id) {
        Map<String, String> res = new HashMap<>();

        for (MultipartFile image : images) {
            System.out.println(String.format("File name: %s", image.getOriginalFilename()));
            try {
                InputStream targetStream = image.getInputStream();
                byte[] buffer = new byte[targetStream.available()];
                targetStream.read(buffer);
                targetStream.close();

                File imageFile = new File(String.format("src/main/resources/static/product-pictures/%d_%s", id, image.getOriginalFilename()));
                OutputStream outStream = new FileOutputStream(imageFile);
                outStream.write(buffer);
                outStream.close();

                ProductPicture pp = new ProductPicture();
                Product product = productService.getById(id);
                pp.setProduct(product);
                pp.setUrl(imageFile.getName());

                productPictureService.create(pp);
            } catch (Exception e) {
                System.out.println("ERROR input stream" + e.toString());
                res.put("message", "failure");
                return res;
            }
        }

        res.put("message", "success");
        return res;
    }

    @GetMapping(value = "/{id}", produces = "application/json")
    @ResponseBody
    public ResponseEntity<Product> getProductById(@PathVariable("id") Integer id) {
        Product product = productService.getById(id);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } else {
            return ResponseEntity.ok(product);
        }
    }
}