package com.eshop.controllers;

import com.eshop.entities.Product;
import com.eshop.services.AuthService;
import com.eshop.services.ProductService;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Controller
@RequestMapping("/api/upload")
@CrossOrigin("http://localhost:3000")
public class UploadController {
    public String index() {
        return "upload";
    }

    @Autowired
    private ProductService productService;

    @GetMapping("/uploadStatus")
    public String uploadStatus() {
        return "uploadStatus";
    }

    @PostMapping
    @ResponseBody
    public ResponseEntity<List<Product>> productUpload(@RequestParam("file") MultipartFile file,
                                                       RedirectAttributes redirectAttributes) {
        List<Product> products = productService.importProducts(file);
        return ResponseEntity.ok(products);
    }

}