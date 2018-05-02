package com.eshop.services;

import com.eshop.dao.CartProductDAO;
import com.eshop.entities.CartProduct;
import com.eshop.entities.Product;
import com.eshop.entities.User;
import org.hibernate.Criteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartProductService {

    @Autowired
    private CartProductDAO cartProductDAO;

    public CartProduct createCartProduct(User user, Product product, Integer quantity){
        CartProduct newUser = new CartProduct(user, product, quantity);
        return cartProductDAO.save(newUser);
    }

    public List<CartProduct> getAllCartProductsForUserId(Integer id){
        return cartProductDAO.findByUserId(id);
    }
}
