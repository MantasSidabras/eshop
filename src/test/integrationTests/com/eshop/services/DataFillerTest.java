package com.eshop.services;

import com.eshop.entities.Order;
import com.eshop.entities.Payment;
import com.eshop.entities.Product;
import com.eshop.entities.User;
import com.eshop.exceptions.UserNotCreatedException;
import org.junit.Ignore;
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

    @Autowired
    private CommerceService commerceService;

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
    public void DataFillerForPresentationTest(String fileName) {

        //Import objects
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

        //Create users
        try {
            User user1 = userService.create(new User("Vartotojas1@test.lt", "User1234", "Vartotojų g. 1", "11111", "Vartotojas", "Vienas", false, false));
            User user2 = userService.create(new User("Vartotojas2@test.lt", "User1234", "Vartotojų g. 2", "22222", "Vartotojas", "Du", false, false));
            User user3 = userService.create(new User("Vartotojas3@etest.lt", "User1234", "Vartotojų g. 3", "33333", "Vartotojas", "Trys", false, true));
            User admin = userService.create(new User("Administratorius@test.lt", "User1234", ";DROP TABLE `users`; g. 15", "151515", "Admministratorius", "Darbštuolis", true, false));

            //Create orders for users
            Iterable<Product> products = productService.findAll();

            createCartProduct(products, "Mindless Voodoo Cayuga II", user1, 1);
            Payment payment = new Payment();
            payment.setHolder(user1.getFirstName() + " " + user1.getLastName());
            payment.setAddress(user1.getAddress());
            payment.setZipCode(user1.getZipCode());
            Order user1Order1 = commerceService.createOrder(user1, payment);
            user1Order1.setState(OrderState.Paid);
            commerceService.updateOrder(user1Order1);
            user1 = userService.findById(user1.getId());

            createCartProduct(products, "Powerslide standard Man M", user1, 1);
            createCartProduct(products, "Wicked SUS Rustproof", user1, 4);
            Order user1Order2 = commerceService.createOrder(user1, payment);
            user1Order2.setState(OrderState.Sent);
            commerceService.updateOrder(user1Order2);

            createCartProduct(products, "SEBA FR1 80 Grey", user2, 2);
            createCartProduct(products, "Ennui City Brace", user2, 2);
            payment.setHolder(user2.getFirstName() + " " + user2.getLastName());
            payment.setAddress(user2.getAddress());
            payment.setZipCode(user2.getZipCode());
            Order user2Order = commerceService.createOrder(user2, payment);
            user2Order.setState(OrderState.Sent);
            commerceService.updateOrder(user2Order);


            createCartProduct(products, "Mindless Voodoo Lakota DT", user3, 1);
            payment.setHolder(user3.getFirstName() + " " + user3.getLastName());
            payment.setAddress(user3.getAddress());
            payment.setZipCode(user3.getZipCode());
            Order user3Order = commerceService.createOrder(user3, payment);
            user3Order.setState(OrderState.Paid);
            commerceService.updateOrder(user3Order);

        }
        catch (Exception ex) {
            fail(ex.getMessage());
        }
    }


    private void createCartProduct(Iterable<Product> products, String productName, User user, int quantity) {
        try {
            Product product = findProductByName(products, productName);
            product.setQuantity(quantity);
            productService.update(product);
            commerceService.createCartProduct(user, product.getId(), quantity);
        }
        catch(Exception ex){
            fail(ex.getMessage());
        }
    }

    private Product findProductByName(Iterable<Product> products, String name) {
        for(Product product : products)
            if(product.getName().equals(name))
                return product;
        return null;
    }
}