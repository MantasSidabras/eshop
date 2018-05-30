package com.eshop.controllers;

import com.eshop.services.AuthService;
import com.eshop.services.ProductService;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Controller
@RequestMapping("/api/upload")
@CrossOrigin("http://localhost:3000")
public class UploadController {

    //Save the uploaded file to this folder
    private static String UPLOADED_FOLDER = "D://eshop_images//";

    public String index() {
        return "upload";
    }

    @Autowired
    private ProductService productService;

    @PostMapping
    @ResponseBody
    public String productUpload(@RequestParam("file") MultipartFile file,
                                  RedirectAttributes redirectAttributes) {
        productService.importProducts(file);
        return "{\"body\": \"Hello, World\"}";
    }

    @GetMapping("/uploadStatus")
    public String uploadStatus() {
        return "uploadStatus";
    }

}