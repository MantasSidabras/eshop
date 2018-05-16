package com.eshop.services;

import com.eshop.dao.CartProductDAO;
import com.eshop.dao.OrderDAO;
import com.eshop.dao.OrderProductDAO;
import com.eshop.dao.ProductDAO;
import com.eshop.entities.*;
import com.eshop.exceptions.ProductCartEmptyException;
import org.junit.BeforeClass;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;

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
            assertEquals(price.multiply(new BigDecimal(quantity)), order.getPrice());
            assertEquals(1, user.getCartProductList().size());
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