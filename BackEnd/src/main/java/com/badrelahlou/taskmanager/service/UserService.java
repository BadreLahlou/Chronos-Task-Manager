package com.badrelahlou.taskmanager.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.badrelahlou.taskmanager.dto.UserProfileResponse;
import com.badrelahlou.taskmanager.dto.UserRegistrationRequest;
import com.badrelahlou.taskmanager.model.User;
import com.badrelahlou.taskmanager.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User createUser(User user) {
        userRepository.findByUsername(user.getUsername())
                .ifPresent(u -> { throw new RuntimeException("Username already exists"); });
        userRepository.findByEmail(user.getEmail())
                .ifPresent(u -> { throw new RuntimeException("Email already exists"); });
    
       
        String plainPassword = user.getPasswordHash();  
        String hashedPassword = passwordEncoder.encode(plainPassword);
        
        user.setPasswordHash(hashedPassword);
        return userRepository.save(user);
    }
    
    public User registerUser(UserRegistrationRequest request) {
        userRepository.findByEmail(request.getEmail())
                .ifPresent(u -> { throw new RuntimeException("Email already exists"); });
        User user = new User();
        user.setUsername(request.getEmail()); // Use email as username for simplicity
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(com.badrelahlou.taskmanager.model.Role.TEAM_MEMBER); // Default role
        // Optionally set firstName/lastName if your User entity supports it
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updatePermissions(Long userId, List<String> permissions) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPermissions(permissions);
        return userRepository.save(user);
    }

    public User authenticate(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    
        System.out.println("Entered Password: " + password);
        System.out.println("Stored Hash: " + user.getPasswordHash());
    
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            System.out.println("Password does NOT match!");
            throw new RuntimeException("Invalid credentials");
        } else {
            System.out.println("Password matches successfully!");
        }
    
        return user;
    }
    
    public User authenticateByEmail(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        return user;
    }

    public UserProfileResponse toUserProfileResponse(User user) {
        UserProfileResponse dto = new UserProfileResponse();
        dto.setId(user.getId());
        // If you add firstName/lastName to User, set them here
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        return dto;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(Long id, User updatedUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());
        user.setRole(updatedUser.getRole());
        if (updatedUser.getPasswordHash() != null) {
            user.setPasswordHash(passwordEncoder.encode(updatedUser.getPasswordHash()));
        }
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        userRepository.delete(user);
    }

   
    public void enableTwoFactor(Long userId, String totpSecret) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setTotpSecret(totpSecret);
        user.setTwoFactorEnabled(true);
        userRepository.save(user);
    }

    public boolean verifyTwoFactor(Long userId, String code) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!user.isTwoFactorEnabled()) return true; // No 2FA required
        // Add TOTP verification logic here (using googleauth library)
        return true; // Placeholder
    }

    public DashboardDTO getUserDashboard(Long userId) {
        return new DashboardService().getUserDashboard(userId);
    }

    public User updateUserSettings(Long id, UserProfileResponse settings) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        // Update only allowed fields (e.g., email, firstName, lastName)
        user.setEmail(settings.getEmail());
        // If you add firstName/lastName to User, update them here
        return userRepository.save(user);
    }

    public List<String> getAllRoles() {
        return java.util.Arrays.stream(com.badrelahlou.taskmanager.model.Role.values())
            .map(Enum::name)
            .collect(java.util.stream.Collectors.toList());
    }

    public void sendPasswordResetEmail(String email) {
        // TODO: Implement email sending logic and token generation
        // For now, just simulate
        if (!userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email not found");
        }
    }

    public void resetPassword(String token, String newPassword) {
        // TODO: Implement token validation and password update
        // For now, just simulate
        if (token == null || token.isEmpty()) throw new RuntimeException("Invalid token");
        // Simulate password reset for demo
    }

    public void verifyEmail(String token) {
        // TODO: Implement email verification logic
        // For now, just simulate
        if (token == null || token.isEmpty()) throw new RuntimeException("Invalid token");
    }
}
