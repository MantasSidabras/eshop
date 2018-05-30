package com.eshop.services;

import com.eshop.dao.CartProductDAO;
import com.eshop.dao.OrderDAO;
import com.eshop.dao.OrderProductDAO;
import com.eshop.dao.ProductDAO;
import com.eshop.entities.*;
import org.junit.jupiter.api.BeforeEach;

import java.math.BigDecimal;

import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;

public class BaseServiceTest {

    protected CartProductDAO cartProductDAO = mock(CartProductDAO.class);
    protected OrderProductDAO orderProductDAO = mock(OrderProductDAO.class);
    protected OrderDAO orderDAO = mock(OrderDAO.class);
    protected ProductDAO productDAO = mock(ProductDAO.class);

    protected User user;

    @BeforeEach
    public void testSetUp() {
        doAnswer(returnsFirstArg()).when(cartProductDAO).save(any(CartProduct.class));
        doAnswer(returnsFirstArg()).when(orderProductDAO).save(any(OrderProduct.class));
        doAnswer(returnsFirstArg()).when(orderDAO).save(any(Order.class));
        doAnswer(returnsFirstArg()).when(productDAO).save(any(Product.class));
        user = new User();
    }

    protected CartProduct createCartProduct(User user, BigDecimal price, int quantity) {
        Product product = new Product("", "", price, quantity);
        CartProduct cartProduct = new CartProduct(user, product, quantity);
        return cartProduct;
    }
}
