package com.eshop.controllers;

import com.eshop.entities.ProductImage;
import com.eshop.entities.User;
import com.eshop.exceptions.UnauthorizedException;
import com.eshop.services.AuthService;
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

    @Autowired
    private AuthService authService;


    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Integer id) {
        ProductImage pp = productImageService.findById(id);

        if (pp == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } else {
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(pp.getData());
        }
    }


    //   //check  if ADMIN
    @DeleteMapping("/{id}")
    @ResponseBody
    public ResponseEntity<Map<String, String>> deleteImage(@RequestHeader("Authorization") String authHead, @PathVariable Integer id) {


        try{
            User tokenUser = authService.getUserFromHeader(authHead);
            authService.authorizeAdmin(tokenUser);

            Map<String, String> res = new HashMap<>();
            this.productImageService.deleteById(id);

            //Returning map to parse as json
            res.put("message", "success");
            return ResponseEntity.ok(res);
        }
        catch(UnauthorizedException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

    }
}
