package com.eshop.dao;

import com.eshop.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDAO extends JpaRepository<Order, Integer> {
    //Basic CRUD auto-implemented

    List<Order> findAllByUserId(Integer id);
}
