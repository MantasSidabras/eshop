package com.eshop.controllers;


import com.eshop.controllers.responsor.UserLoginResponse;
import com.eshop.entities.User;
import com.eshop.exceptions.BlockedUserException;
import com.eshop.exceptions.InvalidUserCredentials;
import com.eshop.exceptions.UserNotFoundException;
import com.eshop.services.JWTTokenService;
import com.eshop.services.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/login")
@CrossOrigin("http://localhost:3000")
public class LoginController {


    @Autowired
    private LoginService loginService;

    @Autowired
    private JWTTokenService jwtTokenService;

    @PostMapping
    @ResponseBody
    public ResponseEntity<UserLoginResponse> login(@RequestBody User user){

           try{
                User loginUser = loginService.verify(user);
                String token = jwtTokenService.generateToken(loginUser);

                UserLoginResponse response = new UserLoginResponse();
                response.setToken(token);
                response.setUser(loginUser);
                return ResponseEntity.ok(response);
           }catch(InvalidUserCredentials ex){
               return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
           } catch (UserNotFoundException e) {
               return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
           } catch (BlockedUserException e) {
               return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
           }

    }
}
