package com.eshop.controllers;

import com.eshop.services.ProductPictureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.*;

@Controller
@RequestMapping(value = "/api/product-picture")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductPictureController {

  @Autowired
  private ProductPictureService productPictureService;

  @GetMapping(value = "/{name}", produces = MediaType.IMAGE_JPEG_VALUE)
  public ResponseEntity<byte[]> getImage(@PathVariable String name) {
    byte[] blob = productPictureService.findByName(name).getData();

    return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(blob);
  }
}
