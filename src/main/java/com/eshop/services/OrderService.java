package com.eshop.services;

import com.eshop.dao.OrderDAO;
import com.eshop.entities.Order;
import com.eshop.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderDAO orderDAO;

    public Order create(User user, String address){
        Order newUser = new Order(user, address);
        return orderDAO.save(newUser);
    }

    public Order update(Order order){
        return orderDAO.save(order);
    }

    public void delete(Order order){
        orderDAO.delete(order);
    }
}
