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
import java.time.LocalDateTime;
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

    public CartProduct createCartProduct(CartProductRequest cartProductRequest) throws InvalidProductQuantityException {
        Product product = productService.findById(cartProductRequest.getProductId());

        if (product.getQuantity().equals(0)) {
            throw new InvalidProductQuantityException();
        }

        CartProduct existing = cartProductDAO.findByProductIdAndUserId(cartProductRequest.getProductId(), cartProductRequest.getUserId());

        if (existing != null) {
//            if (existing.getQuantity().equals(existing.getProduct().getQuantity())) {
//                throw new InvalidProductQuantityException();
//            }
            existing.setQuantity(existing.getQuantity() + 1);
            return cartProductDAO.save(existing);
        }

        CartProduct cp = new CartProduct();
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

        if (cartProduct.getQuantity().equals(0)) {
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

    public void checkIntegrity(User user) throws InvalidProductQuantityException {
        for (CartProduct cp: user.getCartProductList()) {
            if (cp.getQuantity() > cp.getProduct().getQuantity()) {
                throw new InvalidProductQuantityException();
            }
        }
    }

    @Transactional
    public Order createOrder(User user, Payment payment) {
        BigDecimal amount = BigDecimal.ZERO;

        for (CartProduct cp: user.getCartProductList()) {
            amount = amount.add(cp.getProduct().getPrice().multiply(BigDecimal.valueOf(cp.getQuantity())));
        }

        Order order = new Order();

        order.setFullName(payment.getHolder());
        order.setAddress(payment.getAddress());
        order.setZipCode(payment.getZipCode());
        order.setDateCreated(LocalDateTime.now());
        order.setPrice(amount);
        order.setUser(user);

        Order savedOrder = orderDAO.save(order);

        for (CartProduct cp: user.getCartProductList()) {
            OrderProduct op = new OrderProduct();
            op.setOrder(savedOrder);
            op.setProduct(cp.getProduct());
            op.setQuantity(cp.getQuantity());

            op.getProduct().setQuantity(op.getProduct().getQuantity() - op.getQuantity());

            orderProductDAO.save(op);
        }

        this.removeAllFromCartByUserId(user.getId());

        return savedOrder;
    }

    public List<Order> getAllOrders() {
        return this.orderDAO.findAll();
    }

    public Order findOrderById(Integer id) throws Exception {
        Order orderFound = this.orderDAO.findById(id).orElse(null);
        if(orderFound == null){
            throw new Exception();
        }
        else{
            return orderFound;
        }
    }

    public Order updateOrder(Order updated) {
        try {
            Order existing = this.findOrderById(updated.getId());
            updated.setUser(existing.getUser());
            return this.orderDAO.save(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public Order createOrderForUser(User user) throws ProductCartEmptyException {

        if(user.getCartProductList().size() == 0){
            throw new ProductCartEmptyException();
        }
        else {

            Order newOrder = new Order(user);
            orderDAO.save(newOrder);
            for (CartProduct cp : user.getCartProductList()) {
                Product cartProductProduct = cp.getProduct();

                //Creating order products for order
                OrderProduct newOrderProduct = orderProductDAO.save(new OrderProduct(newOrder, cartProductProduct, cp.getQuantity()));
                newOrder.getOrderProductList().add(newOrderProduct);

                //Total price calculation
                newOrder.setPrice(newOrder.getPrice().add(cartProductProduct.getPrice().multiply(new BigDecimal(cp.getQuantity()))));
            }

            //Clear current cart
            user.getCartProductList().clear();

            return orderDAO.save(newOrder);
        }
    }
}
