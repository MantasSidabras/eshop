package com.eshop.controllers;

import com.eshop.controllers.requestors.CartProductRequest;
import com.eshop.dao.CartProductDAO;
import com.eshop.entities.CartProduct;
import com.eshop.entities.User;
import com.eshop.exceptions.*;
import com.eshop.services.AuthService;
import com.eshop.services.CommerceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("api/cartProduct")
@CrossOrigin("http://localhost:3000")
public class CartProductController {

  @Autowired
  private CommerceService commerceService;

  @Autowired
  private CartProductDAO cartProductDAO;

  @Autowired
  private AuthService authService;


  // All users can do it
  @PostMapping
  @ResponseBody
  @ResponseStatus(HttpStatus.CREATED)
  public ResponseEntity<CartProduct> createCartProduct(@RequestHeader("Authorization") String authHead,
                                                       @RequestBody Integer productId){
      try{
          User user = authService.getUserFromHeader(authHead);
          return ResponseEntity.ok(commerceService.createCartProduct(user, productId));
      }
      catch(UnauthorizedException e){
          e.printStackTrace();
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
      }
      catch(ProductNotFoundException e){
          e.printStackTrace();
          return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
      }
  }


  // All users can do it
  @PutMapping
  @ResponseBody
  public ResponseEntity<CartProduct> updateCartProduct(@RequestHeader("Authorization") String authHead,
                                                       @RequestBody CartProduct cp) {
    try {
      User user = authService.getUserFromHeader(authHead);
      CartProduct cpExisting = commerceService.getCartProductById(cp.getId());
      authService.authorizeResource(user, cpExisting.getUser().getId());

      return ResponseEntity.ok(commerceService.updateCartProduct(cp));
    }catch (UnauthorizedException e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    } catch (InvalidProductQuantityException | CartProductNotFoundException e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }
  }


  // All users can do it?
  //check if trying to delete their cartproduct
  @DeleteMapping("/{id}")
  @ResponseBody
  public ResponseEntity<Map<String, String>> deleteCartProduct(@RequestHeader("Authorization") String authHead,
                                               @PathVariable Integer cartProductId) {
      try{
          Map<String, String> res = new HashMap<>();
          User user = authService.getUserFromHeader(authHead);
          CartProduct cpExisting = commerceService.getCartProductById(cartProductId);
          authService.authorizeResource(user, cpExisting.getUser().getId());

          commerceService.removeFromCart(cartProductId);
          res.put("message", "success");
          return ResponseEntity.ok(res);
      }
      catch(UnauthorizedException e){
          e.printStackTrace();
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
      }
      catch(CartProductNotFoundException e){
          e.printStackTrace();
          return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
      }
  }

}
