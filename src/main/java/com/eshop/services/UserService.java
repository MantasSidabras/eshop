package com.eshop.services;

import com.eshop.dao.UserDAO;
import com.eshop.entities.CartProduct;
import com.eshop.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserDAO userDAO;

    public User create(User user){
        return userDAO.save(user);
    }
    public User create(String email, String password, Boolean isAdmin, Boolean isBlocked){
        return userDAO.save(new User(email, password, false, false));
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

    public User getUserByEmail(String email) {
        return userDAO.findByEmail(email);
    }
}
