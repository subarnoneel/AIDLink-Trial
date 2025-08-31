package com.example.AidLink.controller;

import com.example.AidLink.repository.AdminRepository;
import com.example.models.Admin;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/auth")
public class AdminAuthController {
    private final AdminRepository adminRepository;

    public AdminAuthController(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }
   
    
    // DTO for login
    private static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest body, HttpServletRequest req) {
        Admin admin = adminRepository.findByUsername(body.getUsername()).orElse(null);
        System.out.println("Login endpoint called with username: " + body.getUsername());
        System.out.println("Fetched admin from MongoDB: " + (admin != null ? admin.getUsername() + ", password: " + admin.getPassword() : "null"));
        if (admin == null || !admin.getPassword().equals(body.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }

        HttpSession session = req.getSession(true);
        session.setAttribute("ADMIN_USERNAME", admin.getUsername());
        return ResponseEntity.ok(Map.of("message", "ok", "username", admin.getUsername()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest req) {
        HttpSession s = req.getSession(false);
        if (s != null) s.invalidate();
        return ResponseEntity.ok(Map.of("message", "logged out"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest req) {
        HttpSession s = req.getSession(false);
        if (s == null || s.getAttribute("ADMIN_USERNAME") == null) {
            return ResponseEntity.status(401).body(Map.of("message", "not authenticated"));
        }
        return ResponseEntity.ok(Map.of("username", s.getAttribute("ADMIN_USERNAME")));
    }
}
