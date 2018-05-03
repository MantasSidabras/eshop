package com.eshop.services;

import com.eshop.entities.Product;
import com.eshop.entities.User;
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
        userService.create(new User("Mantas", "slaptikas", false, true));
        userService.create(new User("Benas", "miau", false, false));
        userService.create(new User("Paulius", "swx", false, false));
        userService.create(new User("Domas", "asdfasdf", false, true));
        userService.create(new User("Karolis", "ponas", false, false));

        //Create products
        productService.create(new Product("Vienkartinės nosinaitės", "Išsipūsk savo nosį!", BigDecimal.valueOf(0.35), 5));
        productService.create(new Product("Tualetinis popierius", "Gali valytis, o gali ir ne", BigDecimal.valueOf(2.79), 100));
    }
}