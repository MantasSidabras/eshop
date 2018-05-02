package com.eshop.services;

import com.eshop.entities.User;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.*;
@RunWith(SpringRunner.class)
@SpringBootTest
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @Test
    public void createUser_NormalParameters_CreatesUser() {
        //Act
        String email = "Jonas@joneliai.comasdfasdgfasdgsssss";
        String password = "senuks";
        userService.create(email, password);

        //Assert
        User user = userService.getUserByEmail(email);
        assertEquals(email, user.getEmail());
        assertEquals(password, user.getPassword());
    }
}