package com.eshop.services;

import com.eshop.controllers.requestors.CartProductRequest;
import com.eshop.dao.CartProductDAO;
import com.eshop.dao.OrderDAO;
import com.eshop.dao.OrderProductDAO;
import com.eshop.dao.ProductDAO;
import com.eshop.entities.*;
import com.eshop.exceptions.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    public List<CartProduct> getCartProductsForUser(User user) {
        return cartProductDAO.findAllByUserId(user.getId());
    }

    public CartProduct getCartProductByProductIdAndUserId(Integer productId, Integer userId) throws CartProductNotFoundException {
        CartProduct cp = cartProductDAO.findByProductIdAndUserId(productId, userId);
        if (cp == null) {
            throw new CartProductNotFoundException();
        }
        return cp;
    }

    public CartProduct getCartProductById(Integer id) throws CartProductNotFoundException {
        CartProduct cp = cartProductDAO.findById(id).orElse(null);
        if (cp == null) {
            throw new CartProductNotFoundException();
        }
        return cp;
    }


    public CartProduct createCartProduct(User user, Integer productId, Integer initQuantity) throws InvalidProductQuantityException, ProductNotFoundException {
        Product product = productService.findById(productId);

        if (product.getQuantity().equals(0)) {
            throw new InvalidProductQuantityException();
        }

        CartProduct existing = cartProductDAO.findByProductIdAndUserId(productId, user.getId());

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + 1);
            return cartProductDAO.save(existing);
        }

        CartProduct cp = new CartProduct();
        cp.setQuantity(initQuantity);
        cp.setProduct(product);
        cp.setUser(user);

        return cartProductDAO.save(cp);
    }

    public CartProduct updateCartProduct(CartProduct oldCartProduct, Integer newQuantity) throws InvalidProductQuantityException {
        if (newQuantity.compareTo(1) < 0) {
            throw new InvalidProductQuantityException();
        }

        oldCartProduct.setQuantity(newQuantity);

        return cartProductDAO.save(oldCartProduct);
    }

    public CartProduct syncCartProduct(CartProduct oldCartProduct, Integer newQuantity) throws InvalidProductQuantityException {
        if (newQuantity.compareTo(0) < 0) {
            throw new InvalidProductQuantityException();
        }

        oldCartProduct.setQuantity(oldCartProduct.getQuantity() + newQuantity);

        return cartProductDAO.save(oldCartProduct);
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

    public Map<String, String> getMismatchs(User user) {
        Map<String, String> res = new HashMap<>();

        for (CartProduct cp: user.getCartProductList()) {
            if (cp.getQuantity() > cp.getProduct().getQuantity()) {
                res.put(cp.getId().toString(), cp.getProduct().getQuantity().toString());
            }
        }

        return res;
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
