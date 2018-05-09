package com.eshop.services;

import com.eshop.dao.UserDAO;
import com.eshop.entities.CartProduct;
import com.eshop.entities.User;
import com.eshop.exceptions.UserNotFoundException;
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


    public User create(String email, String password, String address, String zipCode, String firstName, String lastName, Boolean isAdmin, Boolean isBlocked){
        return userDAO.save(new User(email, password, address, zipCode, firstName, lastName, isAdmin, isBlocked));
    }

    public List<User> findAll() {
        return userDAO.findAll();
    }

    public User findById(Integer id) throws UserNotFoundException {
        User userFound = userDAO.findById(id).orElse(null);
        if(userFound == null){
            throw new UserNotFoundException();
        }
        else{
            return userFound;
        }
    }

    public User update(User user) {
        return userDAO.save(user);
    }

    public User findByEmail(String email) {
        return userDAO.findByEmail(email);
    }
}
