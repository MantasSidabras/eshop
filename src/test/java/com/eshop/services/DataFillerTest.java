package com.eshop.services;

import com.eshop.entities.Product;
import com.eshop.entities.User;
import com.eshop.exceptions.UserNotCreatedException;
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
    public void createTestData() throws UserNotCreatedException {

        //Create users
        userService.create(new User("Mantas@mantas.com", "slaptikas", "daumantu g. 3", "11111111", "Mantas", "Mantvydas", false, true));
        userService.create(new User("Benas@Benas.com", "miau", "daumantu majonezo g. 69", "2222222", "Benas", "Bentvydas", false, false));
        userService.create(new User("Paulius@Paulius.com", "swa", "heimans ketchup g. 69", "3333333", "Paulius", "Pauliavicius", false, false));
        userService.create(new User("Domas@Domas.com", "domas123", "domo g. 3-13", "444444444", "Domas", "Domas", false, true));
        userService.create(new User("Karolis@Karolis.com", "hashMeOutsideHowBoutDat", "space station, Mars", "0000001", "Karolis", "Karaliavicius", false, false));

        //Create products
        productService.create(new Product("Vienkartinės nosinaitės", "Išsipūsk savo nosį!", BigDecimal.valueOf(0.35), 5));
        productService.create(new Product("Tualetinis popierius", "Gali valytis, o gali ir ne", BigDecimal.valueOf(2.79), 100));
    }
}