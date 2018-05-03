package com.eshop.controllers;

import com.eshop.entities.ProductImage;
import com.eshop.services.ProductImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/api/product-image")
@CrossOrigin("http://localhost:3000")
public class ProductImageController {

    @Autowired
    private ProductImageService productImageService;

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Integer id) {
        ProductImage pp = productImageService.findById(id);

        if (pp == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } else {
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(pp.getData());
        }
    }

    @DeleteMapping("/{id}")
    @ResponseBody
    public Map<String, String> deleteImage(@PathVariable Integer id) {
        Map<String, String> res = new HashMap<>();
        this.productImageService.deleteById(id);
        res.put("message", "success");
        return res;
    }
}
