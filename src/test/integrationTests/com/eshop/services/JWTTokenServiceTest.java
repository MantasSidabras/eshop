package com.eshop.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest
public class JWTTokenServiceTest {


    @Autowired
    private JWTTokenService jwtTokenService;

    // @Value("${jwt.secret}")
    private String secret = "pskmilijonas";

    @Autowired
    private UserService userService;

    /**
     * Tries to parse specified String as a JWT token. If successful, returns User object with username, id and role prefilled (extracted from token).
     * If unsuccessful (token is invalid or not containing all required user properties), simply returns null.
     *
     * @param token the JWT token to parse
     * @return the User object extracted from specified token or null if a token is invalid.
     */

    @Test
    public void parseToken_NormalParameters_TokenParse(){
        try {
            jwtTokenService.parseToken(jwtTokenService.generateToken(userService.findById(1)));
        }
        catch(Exception e){
            fail("ERROR parsingg token in test");
        }
    }

    /**
     * Generates a JWT token containing username as subject, and userId and role as additional claims. These properties are taken from the specified
     * User object. Tokens validity is infinite.
     *
     *  the user for which the token will be generated
     *  the JWT token
     */
    @Test
    public void generateToken_NormalParameters_TokenIsCreated() {

        String token;
        try{
            token = jwtTokenService.generateToken(userService.findById(1));
        }
        catch(Exception e){
            fail("ERROR CREATING TOKEN");

        }
    }
}
