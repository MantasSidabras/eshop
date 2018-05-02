package com.eshop.services;

import com.eshop.entities.Product;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class DataFillerTest {

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Test
    public void createTestData() {

        //Create users

        userService.createUser("Mantas", "slaptikas");
        userService.createUser("Benas", "miau");
        userService.createUser("Paulius", "swx");
        userService.createUser("Domas", "asdfasdf");
        userService.createUser("Karolis", "ponas");

        //Create products
        productService.createProduct("Vienkartinės nosinaitės", "Išsipūsk savo nosį!", BigDecimal.valueOf(0.35), 5);
        productService.createProduct("Tualetinis popierius", "Gali valytis, o gali ir ne", BigDecimal.valueOf(2.79), 100);
    }
}