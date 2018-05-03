package com.eshop.controllers;

import com.eshop.entities.ProductImage;
import com.eshop.services.ProductImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping(value = "/api/product-image")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductImageController {

  @Autowired
  private ProductImageService productImageService;

  @GetMapping(value = "/{id}", produces = MediaType.IMAGE_JPEG_VALUE)
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
  public void deleteImage(@PathVariable Integer id) {
    this.productImageService.deleteById(id);
  }
}
