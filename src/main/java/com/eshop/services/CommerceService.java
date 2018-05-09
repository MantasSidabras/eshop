package com.eshop.services;

import com.eshop.dao.CartProductDAO;
import com.eshop.dao.OrderDAO;
import com.eshop.dao.OrderProductDAO;
import com.eshop.dao.ProductDAO;
import com.eshop.entities.*;
import com.eshop.exceptions.InvalidProductQuantityException;
import com.eshop.exceptions.ProductCartEmptyException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CommerceService {



    @Autowired
    private CartProductDAO cartProductDAO;

    @Autowired
    private OrderProductDAO orderProductDAO;

    @Autowired
    private OrderDAO orderDAO;

    @Autowired
    private ProductDAO productDAO;

    public List<CartProduct> getCartProductsForUserById(Integer id){
        return cartProductDAO.findAllByUserId(id);
    }

    public List<CartProduct> getCartProductsForUser(User user){
        return cartProductDAO.findAllByUserId(user.getId());
    }


    public CartProduct addToCartForUser(User user, Product product, Integer quantity)
            throws InvalidProductQuantityException {

        if(quantity > product.getQuantity()){
            throw new InvalidProductQuantityException();
        }
        /*else{
            product.setQuantity(product.getQuantity() - quantity);

            productDAO.save(product);
        }*/

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
            Order newOrder = new Order(user);
            for (CartProduct cp : user.getCartProductList()) {
                Product cartProductProduct = cp.getProduct();

                //Creating order products for order
                newOrder.getOrderProductList().add(orderProductDAO.save(new OrderProduct(newOrder, cartProductProduct, cp.getQuantity())));

                //Total price calculation
                newOrder.getPrice().add(cartProductProduct.getPrice().multiply(new BigDecimal(cp.getQuantity())));
            }

            //Clear current cart
            user.getCartProductList().clear();

            return orderDAO.save(newOrder);
        }
    }
}
