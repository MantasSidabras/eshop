package com.eshop.services;

import com.eshop.entities.User;
import com.eshop.exceptions.BlockedUserException;
import com.eshop.exceptions.InvalidUserCredentials;
import com.eshop.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    @Autowired
    private UserService userService;
    private PasswordEncoder encoder = new BCryptPasswordEncoder();

    public User verify(User user) throws InvalidUserCredentials, BlockedUserException, UserNotFoundException{

        try{
            User foundUser = userService.findByEmail(user.getEmail());

            if(!encoder.matches(user.getPassword(), foundUser.getPassword())){
                throw new InvalidUserCredentials();
            }

            if(foundUser.isBlocked()){
                throw new BlockedUserException();
            }

            return foundUser;
        }
        catch(UserNotFoundException e){
            throw new UserNotFoundException();
        }

    }
}
