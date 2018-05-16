package com.eshop.services;

import com.eshop.controllers.requestors.CartProductRequest;
import com.eshop.dao.CartProductDAO;
import com.eshop.dao.OrderDAO;
import com.eshop.dao.OrderProductDAO;
import com.eshop.dao.ProductDAO;
import com.eshop.entities.*;
import com.eshop.exceptions.InvalidProductQuantityException;
import com.eshop.exceptions.ProductCartEmptyException;
import com.eshop.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
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


    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    public CommerceService(CartProductDAO cartProductDAO, OrderProductDAO orderProductDAO, OrderDAO orderDAO, ProductDAO productDAO) {
        this.cartProductDAO = cartProductDAO;
        this.orderProductDAO = orderProductDAO;
        this.orderDAO = orderDAO;
        this.productDAO = productDAO;
    }
    public List<CartProduct> getCartProductsByUserId(Integer id){
        return cartProductDAO.findAllByUserId(id);
    }

    public List<CartProduct> getCartProductsForUser(User user){
        return cartProductDAO.findAllByUserId(user.getId());
    }

    public CartProduct getCartProductById(Integer id){
        return cartProductDAO.findById(id).orElse(null);
    }

    public CartProduct createCartProduct(CartProductRequest cartProductRequest) {
        CartProduct existing = cartProductDAO.findByProductIdAndUserId(cartProductRequest.getProductId(), cartProductRequest.getUserId());

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + 1);
            return cartProductDAO.save(existing);
        }

        CartProduct cp = new CartProduct();
        Product product = productService.findById(cartProductRequest.getProductId());
        User user;

        cp.setQuantity(1);
        cp.setProduct(product);

        try {
            user = userService.findById(cartProductRequest.getUserId());
            cp.setUser(user);
        } catch (UserNotFoundException e) { e.printStackTrace();}

        return cartProductDAO.save(cp);
    }

//    public CartProduct addToCartForUser(User user, Product product, Integer quantity)
//            throws InvalidProductQuantityException {
//
//        if (quantity > product.getQuantity()) {
//            throw new InvalidProductQuantityException();
//        }
//
//        return cartProductDAO.save(new CartProduct(user, product, quantity));
//    }

    public CartProduct updateCartProduct(CartProduct cartProduct) throws InvalidProductQuantityException {
        CartProduct oldCartProduct = this.getCartProductById(cartProduct.getId());

        if (cartProduct.getQuantity() > oldCartProduct.getProduct().getQuantity()) {
            throw new InvalidProductQuantityException();
        }

        cartProduct.setProduct(oldCartProduct.getProduct());
        cartProduct.setUser(oldCartProduct.getUser());

        return cartProductDAO.save(cartProduct);
    }

    public void removeFromCart(Integer id){
        cartProductDAO.deleteById(id);
    }

    @Transactional
    public void removeAllFromCartByUserId(Integer id){
        cartProductDAO.deleteAllByUserId(id);
    }

    public Order createOrderForUser(User user) throws ProductCartEmptyException {

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
                newOrder.setPrice(newOrder.getPrice().add(cartProductProduct.getPrice().multiply(new BigDecimal(cp.getQuantity()))));
            }

            //Clear current cart
            user.getCartProductList().clear();

            return orderDAO.save(newOrder);
        }
    }
}
