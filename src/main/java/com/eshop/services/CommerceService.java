package com.eshop.services;

import com.eshop.dao.CartProductDAO;
import com.eshop.dao.OrderDAO;
import com.eshop.dao.OrderProductDAO;
import com.eshop.entities.*;
import com.eshop.exceptions.ProductCartEmptyException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommerceService {



    @Autowired
    private CartProductDAO cartProductDAO;

    @Autowired
    private OrderProductDAO orderProductDAO;

    @Autowired
    private OrderDAO orderDAO;

    public List<CartProduct> getCartProductsForUserById(Integer id){
        return cartProductDAO.findAllByUserId(id);
    }

    public List<CartProduct> getCartProductsForUser(User user){
        return cartProductDAO.findAllByUserId(user.getId());
    }

    public CartProduct addToCartForUser(User user, Product product, Integer quantity){
        return cartProductDAO.save(new CartProduct(user, product, quantity));
    }
    public CartProduct updateCartProduct(CartProduct cartProduct){
        return cartProductDAO.save(cartProduct);
    }
    public void removeFromCart(Integer id){
        cartProductDAO.deleteById(id);
    }

    public Order createOrderForUser(User user, String address) throws ProductCartEmptyException {

        if(user.getCartProductList().size() == 0){
            throw new ProductCartEmptyException();
        }
        else {
            Order newOrder = new Order(user, address);
            for (CartProduct cp : user.getCartProductList()) {
                Product cartProductProduct = cp.getProduct();

                //Creating order products for order
                newOrder.getOrderProductList().add(orderProductDAO.save(new OrderProduct(newOrder, cartProductProduct, cp.getQuantity())));

                //Total price calculation
                newOrder.getPrice().add(cartProductProduct.getPrice());
            }

            //Clear current cart
            user.getCartProductList().clear();

            return orderDAO.save(newOrder);
        }
    }
}
