package com.eshop.services;

import com.eshop.entities.User;
import com.eshop.exceptions.UnauthorizedException;
import com.eshop.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
  @Autowired
  JWTTokenService jwtTokenService;

  @Autowired
  UserService userService;

  public User getUserFromHeader(String header) throws UnauthorizedException {
    try {
      if (header == null || !header.startsWith("Bearer ")) {
        throw new UnauthorizedException();
      }

      String token = header.substring(7);
      Integer payloadId = jwtTokenService.parseToken(token);
      return userService.findById(payloadId);
    } catch (Exception e) {
      throw new UnauthorizedException();
    }
  }

  public void authorizeResource(User user, Integer resourceId) throws UnauthorizedException {
    if (!user.getId().equals(resourceId)) {
      throw new UnauthorizedException();
    }
  }

  public void authorizeAdmin(User user) throws UnauthorizedException {
    if (!user.isAdmin()) {
      throw new UnauthorizedException();
    }
  }
}
