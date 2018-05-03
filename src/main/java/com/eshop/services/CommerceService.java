package com.eshop.services;

import com.eshop.dao.CartProductDAO;
import com.eshop.entities.CartProduct;
import com.eshop.entities.Order;
import com.eshop.entities.Product;
import com.eshop.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommerceService {



    @Autowired
    private CartProductDAO cartProductDAO;

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
    //    public Order makeOrderForUserById(Integer id){
//        Order newOrder =
//    }
}
