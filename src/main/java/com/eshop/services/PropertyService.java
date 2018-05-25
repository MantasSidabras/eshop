package com.eshop.services;

import com.eshop.dao.PropertyDAO;
import com.eshop.entities.Property;
import org.springframework.beans.factory.annotation.Autowired;

public class PropertyService {
    @Autowired
    PropertyDAO propertyDAO;

}