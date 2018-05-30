package com.eshop.services;

import com.eshop.entities.*;
import com.eshop.exceptions.ProductCartEmptyException;
import org.junit.jupiter.api.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class CommerceServiceTest extends BaseServiceTest {

    private CommerceService service = new CommerceService(cartProductDAO, orderProductDAO, orderDAO, productDAO);

    @Test
    public void createOrderForUser_NormalParameters_OrderIsCreated() {
        //Arrange
        //TODO: use addProductToCart method when it is implemented.
        List<CartProduct> cartProducts = new ArrayList<>();
        BigDecimal price = new BigDecimal("2.5");
        int quantity = 3;
        cartProducts.add(createCartProduct(user, price, quantity));
        user.setCartProductList(cartProducts);
        //Act
        try {
            Order order = service.createOrderForUser(user);

            //Assert
            assertEquals(price.multiply(new BigDecimal(quantity)), order.getPrice());
            assertEquals(1, user.getOrderList().size());
        }
        catch (Exception ex) {
            fail("createOrderForUser has thrown an exception: " + ex.getMessage());
        }
    }

    @Test
    public void createOrderForUser_normal_ThrowsException() {
        //Act and Assert
        Assertions.assertThrows(ProductCartEmptyException.class, () -> {
            service.createOrderForUser(user);
        });
    }
}