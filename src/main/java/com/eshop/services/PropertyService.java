package com.eshop.services;

import com.eshop.dao.PropertyDAO;
import com.eshop.entities.Property;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PropertyService {
    @Autowired
    PropertyDAO propertyDAO;

    public void create(List<Property> properties){
        propertyDAO.saveAll(properties);
    }

    public List<Property> getProperties(Integer id){
        return propertyDAO.findAllByProductId(id);
    }

    public void delete(int id){
        propertyDAO.deleteById(id);
    }
}