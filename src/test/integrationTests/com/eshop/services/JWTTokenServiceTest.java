package com.eshop.services;

import com.eshop.entities.User;
import com.eshop.exceptions.TokenParseException;
import com.eshop.exceptions.UserNotCreatedException;
import com.eshop.exceptions.UserNotFoundException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.security.Key;
import java.util.Date;

@RunWith(SpringRunner.class)
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
            System.out.println("ERROR PARSINg token in test");
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
            System.out.println("ERROR CRETING TOKEN");

        }
    }
}
