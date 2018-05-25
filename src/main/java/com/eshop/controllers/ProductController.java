package com.eshop.controllers;

import com.eshop.entities.Product;
import com.eshop.entities.ProductImage;
import com.eshop.entities.User;
import com.eshop.exceptions.UnauthorizedException;
import com.eshop.services.AuthService;
import com.eshop.services.ProductImageService;
import com.eshop.services.ProductService;
import org.hibernate.dialect.lock.OptimisticEntityLockException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
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

    @Autowired
    private AuthService authService;


    //Only admin
    @PostMapping
    @ResponseBody
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Product> createProduct(@RequestHeader("Authorization") String authHead, @RequestBody Product product) {

        try{
            User tokenUser = authService.getUserFromHeader(authHead);
            authService.authorizeAdmin(tokenUser);

            //change localDateNow logic
            //product.setDateCreated(LocalDateTime.now());
            return ResponseEntity.ok(this.productService.create(product));
        }
        catch(UnauthorizedException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    //Everyone can use
    @GetMapping
    @ResponseBody
    public List<Product> getAllProducts() {
        return productService.findAll();
    }


    //Everyone can use
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


    //Only admin
    @PutMapping
    @ResponseBody
    public ResponseEntity<Product> updateProduct(@RequestHeader("Authorization") String authHead, @RequestBody Product product) {

        try{
            User tokenUser = authService.getUserFromHeader(authHead);
            authService.authorizeAdmin(tokenUser);

            return ResponseEntity.ok(this.productService.update(product));
        }
        catch(UnauthorizedException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        } catch(ObjectOptimisticLockingFailureException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }


    //Only admin
    @DeleteMapping("/{id}")
    @ResponseBody
    public ResponseEntity<Map<String, String>> deleteProduct(@RequestHeader("Authorization") String authHead, @PathVariable("id") Integer id) {

        try{
            User tokenUser = authService.getUserFromHeader(authHead);
            authService.authorizeAdmin(tokenUser);
            Map<String, String> res = new HashMap<>();
            this.productService.deleteById(id);
            res.put("message", "success");
            return ResponseEntity.ok(res);
        }
        catch(UnauthorizedException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    //Only admin
    @PostMapping("/{id}/images")
    @ResponseBody
    public ResponseEntity<Map<String, String>> setImages(@RequestHeader("Authorization") String authHead, @PathVariable("id") Integer id, @RequestParam("file") MultipartFile[] images) {

        try{
            User tokenUser = authService.getUserFromHeader(authHead);
            authService.authorizeAdmin(tokenUser);

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
                    return ResponseEntity.ok(res);
                }
            }

            res.put("message", "success");
            return ResponseEntity.ok(res);
        }
        catch(UnauthorizedException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

    }
}