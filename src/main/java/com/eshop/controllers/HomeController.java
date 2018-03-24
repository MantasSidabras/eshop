package com.eshop.controllers;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by Domas on 2018-03-24.
 */
@Controller
public class HomeController implements ErrorController {

    private static final String PATH = "/error";

    @RequestMapping(value = PATH)
    public String error() {
        return "index.html";
    }

    @Override
    public String getErrorPath() {
        return PATH;
    }
}
