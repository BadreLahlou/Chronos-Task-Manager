package com.badrelahlou.taskmanager.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Data;

@Entity
@Table(name = "users")
@Data 
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    @JsonIgnore
    private String passwordHash;
    
    @Column(nullable = false, unique = true)
    private String email;

    

    @ElementCollection
    private List<String> permissions;

    
    @Column
    private String totpSecret; 

    @Column
    private boolean isTwoFactorEnabled; 
    
    @Transient 
    private String password; 
    
    public String getPassword() {
        return password;
    }

    public void setUsername(String username) { this.username = username; }
    public String getUsername() { return this.username; }
    public void setEmail(String email) { this.email = email; }
    public String getEmail() { return this.email; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getPasswordHash() { return this.passwordHash; }
    public void setRole(Role role) { this.role = role; }
    public Role getRole() { return this.role; }
    public void setId(Long id) { this.id = id; }
    public Long getId() { return this.id; }
}
