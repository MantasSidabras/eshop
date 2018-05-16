package com.eshop.services;

import com.eshop.entities.User;
import com.eshop.exceptions.UserNotCreatedException;
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

   // @Autowired
   // private BCryptPasswordEncoder passwordEncoder;

    @Test
    public void createUser_NormalParameters_CreatesUser() throws UserNotCreatedException {
        //Act
        String email = "vardeniss@domain.lt";
        String password = "senkuks";
        String address = "pvz addresiukas";
        String zipCode = "33333333";
        String firstName = "FirstNameExample";
        String lastName = "LastNameExample";

        // encodedpassword = passwordEncoder.encode(password);
        userService.create(new User(email, password, address, zipCode, firstName, lastName, false, false));

        //Assert
        try {
            User user = userService.findByEmail(email);
            assertEquals(email, user.getEmail());
            assertEquals(password, user.getPassword());
            assertEquals(address, user.getAddress());
            assertEquals(zipCode, user.getZipCode());
            assertEquals(firstName, user.getFirstName());
            assertEquals(lastName, user.getLastName());
        }
        catch(Exception e){
            fail("COUGHT EXCEPTION IN USER CREATE NORMAL");
        }
    }
}