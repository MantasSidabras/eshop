package com.eshop.services;

import com.eshop.entities.User;
import com.eshop.exceptions.TokenParseException;
import com.eshop.exceptions.UserNotCreatedException;
import com.eshop.exceptions.UserNotFoundException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.security.Key;
import java.util.Date;

@Service
public class JWTTokenService {


    @Autowired
    private UserService userService;

   // @Value("${jwt.secret}")
    private String secret = "pskmilijonas";
    private long expirationTimeInMillis = 30000;
    /**
     * Tries to parse specified String as a JWT token. If successful, returns User object with username, id and role prefilled (extracted from token).
     * If unsuccessful (token is invalid or not containing all required user properties), simply returns null.
     *
     * @param token the JWT token to parse
     * @return the User object extracted from specified token or null if a token is invalid.
     */
    public User parseToken(String token) throws UserNotFoundException, TokenParseException{
        try {
            Claims body = Jwts.parser()
                    .setSigningKey(secret)
                    .parseClaimsJws(token)
                    .getBody();

            Integer id = (Integer) body.get("id");
            Long exptime = Long.parseLong (body.get("exp").toString());
            String subject = (String) body.get("sub");

            try{
                return userService.findById(id);
            }catch (UserNotFoundException e){
                throw e;
            }
        } catch (JwtException | ClassCastException e) {
            throw new TokenParseException();
        }
    }

    /**
     * Generates a JWT token containing username as subject, and userId and role as additional claims. These properties are taken from the specified
     * User object. Tokens validity is infinite.
     *
     *  the user for which the token will be generated
     *  the JWT token
     */
    public String generateToken(User user) {
        Claims claims = Jwts.claims().setSubject(user.getEmail());
        claims.put("id", user.getId());

        return Jwts.builder()
                .setClaims(claims)
                .signWith(SignatureAlgorithm.HS512, secret)
                .setExpiration(new Date(System.currentTimeMillis() + expirationTimeInMillis))
                .compact();
    }
}
