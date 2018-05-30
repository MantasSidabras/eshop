package com.eshop.services;

import com.eshop.entities.Product;
import com.eshop.entities.User;
import com.eshop.exceptions.UserNotCreatedException;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.junit.jupiter.api.Assertions.fail;


@ExtendWith(SpringExtension.class)
@SpringBootTest
public class DataFillerTest {

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Test
    public void createTestData() throws UserNotCreatedException {

        //Create users
        userService.create(new User("man", "m", "daumantu g. 3", "11111111", "Mantas", "Mantvydas", true, false));
        userService.create(new User("Benas@Benas.com", "miau", "daumantu majonezo g. 69", "2222222", "Benas", "Bentvydas", false, false));
        userService.create(new User("Paulius@Paulius.com", "swa", "heimans ketchup g. 69", "3333333", "Paulius", "Pauliavicius", false, false));
        userService.create(new User("Domas@Domas.com", "domas123", "domo g. 3-13", "444444444", "Domas", "Domas", false, true));
        userService.create(new User("kar", "k", "space station, Mars", "0000001", "Karolis", "Karaliavicius", false, false));

        //Create products
        productService.create(new Product("Vienkartinės nosinaitės", "Išsipūsk savo nosį!", BigDecimal.valueOf(0.35), 5));
        productService.create(new Product("Tualetinis popierius", "Gali valytis, o gali ir ne", BigDecimal.valueOf(2.79), 100));
    }

    @ParameterizedTest
    @ValueSource(strings = { "PresentationFiller.xlsx" })
    public void ImportDataFromXlsxFile(String fileName) {

        ClassLoader classLoader = getClass().getClassLoader();
        try {
            Path path = Paths.get(classLoader.getResource(fileName).toURI());

            byte[] content = null;
            content = Files.readAllBytes(path);
            MultipartFile file = new MockMultipartFile(fileName,
                    fileName, "text/plain", content);
            productService.importProducts(file);
        }
        catch (Exception ex) {
            fail(ex.getMessage());
        }
    }
}