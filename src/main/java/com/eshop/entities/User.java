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
@Table(name = "USERS")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Size(min = 3, max = 128)
    private String email;

    private String password;

    private boolean isAdmin;

    private boolean isDeleted;

    private LocalDateTime dateCreated;

//    @OneToMany(mappedBy = "userId")
//    private List<CartProduct> productList = new ArrayList<>();
//
//    @OneToMany(mappedBy = "userId")
//    private List<Order> orderList = new ArrayList<>();

    public User(){}

    public User(String email, String password){
        this.email = email;
        this.password = password;
        this.isAdmin = false;
        this.isDeleted = false;
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
}
