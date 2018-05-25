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
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("api/cartProduct")
@CrossOrigin("http://localhost:3000")
public class CartProductController {

  @Autowired
  private CommerceService commerceService;

  @Autowired
  private AuthService authService;

  @GetMapping
  @ResponseBody
  public ResponseEntity<List<CartProduct>> getCartByUserId(@RequestHeader("Authorization") String authHead){

    try{
      User tokenUser = authService.getUserFromHeader(authHead);
      return ResponseEntity.ok(commerceService.getCartProductsByUserId(tokenUser.getId()));
    }
    catch(UnauthorizedException e){
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }
  }

  // All users can do it
  @PostMapping
  @ResponseBody
  @ResponseStatus(HttpStatus.CREATED)
  public ResponseEntity<CartProduct> createCartProduct(@RequestHeader("Authorization") String authHead,
                                                       @RequestBody Integer productId){
      try{
          User user = authService.getUserFromHeader(authHead);
          return ResponseEntity.ok(commerceService.createCartProduct(user, productId, 1));
      }
      catch(UnauthorizedException e){
          e.printStackTrace();
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
      }
      catch(ProductNotFoundException | InvalidProductQuantityException e){
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

      return ResponseEntity.ok(commerceService.updateCartProduct(cpExisting, cp.getQuantity()));

    } catch (UnauthorizedException e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

    } catch (InvalidProductQuantityException | CartProductNotFoundException e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }
  }

  @DeleteMapping
  @ResponseBody
  public ResponseEntity<Map<String, String>> deleteAllCartProducts(@RequestHeader("Authorization") String authHead) {

    try {
      User tokenUser = authService.getUserFromHeader(authHead);
      Map<String, String> res = new HashMap<>();
      this.commerceService.removeAllFromCartByUserId(tokenUser.getId());

      //Returning map to parse as json
      res.put("message", "success");
      return ResponseEntity.ok(res);
    }
    catch(UnauthorizedException e){
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }
  }

  @PutMapping("/sync")
  @ResponseBody
  public ResponseEntity<CartProduct> syncCartProduct(@RequestHeader("Authorization") String authHead,
                                                       @RequestBody CartProduct cp) {
    User user = new User();
    try {
      user = authService.getUserFromHeader(authHead);
      CartProduct cpExisting = commerceService.getCartProductByProductIdAndUserId(cp.getProduct().getId(), user.getId());
      authService.authorizeResource(user, cpExisting.getUser().getId());

      return ResponseEntity.ok(commerceService.syncCartProduct(cpExisting, cp.getQuantity()));

    } catch (UnauthorizedException e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

    } catch (InvalidProductQuantityException e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);

    } catch (CartProductNotFoundException e) {
      try {
        return ResponseEntity.ok(commerceService.createCartProduct(user, cp.getProduct().getId(), cp.getQuantity()));

      } catch (ProductNotFoundException | InvalidProductQuantityException ex) {
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
      }
    }
  }


  // All users can do it?
  //check if trying to delete their cartproduct
  @DeleteMapping("/{id}")
  @ResponseBody
  public ResponseEntity<Map<String, String>> deleteCartProduct(@RequestHeader("Authorization") String authHead,
                                               @PathVariable Integer id) {
      try {
          Map<String, String> res = new HashMap<>();
          User user = authService.getUserFromHeader(authHead);
          CartProduct cpExisting = commerceService.getCartProductById(id);
          authService.authorizeResource(user, cpExisting.getUser().getId());

          commerceService.removeFromCart(id);
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
