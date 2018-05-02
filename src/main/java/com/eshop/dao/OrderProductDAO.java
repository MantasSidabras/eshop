package com.eshop.dao;

import com.eshop.entities.OrderProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderProductDAO extends JpaRepository<OrderProduct, Integer> {
    //Basic CRUD auto-implemented
}
