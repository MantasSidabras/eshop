package com.eshop.controllers;

import com.eshop.entities.ProductPicture;
import com.eshop.services.ProductPictureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping(value = "/api/product-picture")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductPictureController {

  @Autowired
  private ProductPictureService productPictureService;

  @GetMapping(value = "/{id}", produces = MediaType.IMAGE_JPEG_VALUE)
  public ResponseEntity<byte[]> getImage(@PathVariable Integer id) {
    ProductPicture pp = productPictureService.findById(id);

    if (pp == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    } else {
      return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(pp.getData());
    }
  }

  @DeleteMapping("/{id}")
  @ResponseBody
  public void deleteImage(@PathVariable Integer id) {
    this.productPictureService.deleteById(id);
  }
}
