package com.eshop.services;

import com.eshop.dao.UserDAO;
import com.eshop.entities.CartProduct;
import com.eshop.entities.User;
import com.eshop.exceptions.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserDAO userDAO;

   // @Autowired
    //private BCryptPasswordEncoder passwordEncoder;

    public User create(User user) throws UserNotCreatedException {
        //user.setPassword(passwordEncoder.encode(user.getPassword()));
        User newUser = userDAO.save(user);
        if(newUser == null){
            throw new UserNotCreatedException();
        } else {
            return userDAO.save(newUser);
        }
    }
    
    public User create(String email, String password, String address, String zipCode, String firstName, String lastName, Boolean isAdmin, Boolean isBlocked){
        return userDAO.save(new User(email, password, address, zipCode, firstName, lastName,isAdmin, isBlocked));
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

    private User processEditAccount(User existing, User updated) {
        if (updated.getPassword() == null || updated.getPassword().equals("")) {
            updated.setPassword(existing.getPassword());
        }

        updated.setDateCreated(existing.getDateCreated());
        updated.setAdmin(existing.isAdmin());
        updated.setBlocked(existing.isBlocked());

        return userDAO.save(updated);
    }

    public User update(Integer senderId, User updated) {
        try {
            User sender = this.findById(senderId);
            User existing = this.findById(updated.getId());

            // jei admin
            if (sender.isAdmin()) {
                // jei editina savo acc
                if (sender.getId().equals(updated.getId())) {
                    return processEditAccount(existing, updated);
                } else {
                    // jei bando editint kita admin
                    if (existing.isAdmin()) {
                        return null;
                    // jei bando editint user
                    } else {
                        existing.setBlocked(updated.isBlocked());
                        return userDAO.save(existing);
                    }
                }
            // jei user
            } else {
                return processEditAccount(existing, updated);
            }
        } catch (UserNotFoundException e) {
            e.printStackTrace();
            return null;
        }
    }

    public User findByEmail(String email) {
        return userDAO.findByEmail(email);
    }



}
