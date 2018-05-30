package com.eshop.services;

import com.eshop.entities.Order;
import com.eshop.entities.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest
public class CommerceServiceTest2 {

    @Autowired
    private CommerceService commerceService;

    @Autowired
    private UserService userService;

    private User myUser;

    //@BeforeEach
    //public void setupData
    @Test
    public void createOrderForUser_NormalParameters_OrderIsCreated() {
        //Act
        try{

            User myUser = userService.findById(1);

            Order order = commerceService.createOrderForUser(myUser);

            //Assert
            assertEquals(1, order.getOrderProductList().size());
        }
        catch (Exception e){
            fail(e.getMessage());
        }
    }
}