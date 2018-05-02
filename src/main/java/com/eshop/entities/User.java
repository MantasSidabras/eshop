package com.eshop.entities;

import com.fasterxml.jackson.annotation.JsonTypeId;
import jdk.nashorn.internal.objects.annotations.Getter;
import jdk.nashorn.internal.objects.annotations.Setter;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Size(min = 3, max = 128)
    @Column(unique = true)
    private String email;

    private String password;

    private boolean isAdmin;

    private boolean isDeleted;

    private LocalDateTime dateCreated;

    @OneToMany(mappedBy = "user")
    private List<CartProduct> cartProductList = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<Order> orderList = new ArrayList<>();

    public User(){}

    public User(String email, String password, Boolean isAdmin, Boolean isDeleted){
        this.email = email;
        this.password = password;
        this.isAdmin = isAdmin;
        this.isDeleted = isDeleted;
        this.dateCreated =  LocalDateTime.now();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean deleted) {
        isDeleted = deleted;
    }

    public LocalDateTime getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(LocalDateTime dateCreated) {
        this.dateCreated = dateCreated;
    }

    public List<Order> getOrderList() {
        return orderList;
    }

    public void setOrderList(List<Order> orderList) {
        this.orderList = orderList;
    }

    public List<CartProduct> getCartProductList() {
        return cartProductList;
    }

    public void setCartProductList(List<CartProduct> cartProductList) {
        this.cartProductList = cartProductList;
    }
}
