package com.eshop.controllers;

import com.eshop.controllers.requestors.CartProductRequest;
import com.eshop.entities.CartProduct;
import com.eshop.entities.User;
import com.eshop.exceptions.InvalidProductQuantityException;
import com.eshop.exceptions.UserNotFoundException;
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


  // All users can do it
  @PostMapping
  @ResponseBody
  @ResponseStatus(HttpStatus.CREATED)
  public ResponseEntity<CartProduct> createCartProduct(@RequestBody CartProductRequest cartProductRequest){
    CartProduct newCp;
    try {
      newCp = commerceService.createCartProduct(cartProductRequest);
    } catch (InvalidProductQuantityException e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }
    return ResponseEntity.ok(newCp);
  }


  // All users can do it
  @PutMapping
  @ResponseBody
  public ResponseEntity<CartProduct> updateCartProduct(@RequestBody CartProduct cp) {
    try {
      return ResponseEntity.ok(commerceService.updateCartProduct(cp));
    } catch (InvalidProductQuantityException e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }
  }


  // All users can do it?
  @DeleteMapping("/{id}")
  @ResponseBody
  public Map<String, String> deleteCartProduct(@PathVariable Integer id) {
    Map<String, String> res = new HashMap<>();
    this.commerceService.removeFromCart(id);
    res.put("message", "success");
    return res;
  }

}