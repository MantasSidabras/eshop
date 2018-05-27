package com.eshop.services;

import com.eshop.entities.User;
import com.eshop.exceptions.TokenParseException;
import com.eshop.exceptions.UnauthorizedException;
import com.eshop.exceptions.UserNotCreatedException;
import com.eshop.exceptions.UserNotFoundException;
import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.security.Key;
import java.util.Date;

@Service
public class JWTTokenService {

   // @Value("${jwt.secret}")
    private String secret = "pskmilijonas";
    private long expirationTimeInMillis = 3000000;

    public Integer parseToken(String token) throws TokenParseException {
        try {
            Claims body = Jwts.parser()
                    .setSigningKey(secret)
                    .parseClaimsJws(token)
                    .getBody();

            return (Integer) body.get("id");
        } catch (JwtException | ClassCastException e) {
            throw new TokenParseException();
        }
    }

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
