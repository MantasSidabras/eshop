package com.eshop.services;

import com.eshop.dao.UserDAO;
import com.eshop.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserDAO userDAO;

    public User create(String email, String password){
        User newUser = new User(email, password);
        return userDAO.save(newUser);
    }

    public List<User> getAll(){
        return userDAO.findAll();
    }

    public User getById(Integer id) {
        return userDAO.findById(id).orElse(null);
    }

    public User update(User user) {
        return userDAO.save(user);
    }
}
