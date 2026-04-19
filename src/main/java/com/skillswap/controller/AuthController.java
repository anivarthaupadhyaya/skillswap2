package com.skillswap.controller;

import com.skillswap.entity.User;
import com.skillswap.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpSession;

@Controller
public class AuthController {
    
    @Autowired
    private UserService userService;

    @GetMapping("/auth/login")
    public String loginPage() {
        return "auth/login";
    }

    @GetMapping("/auth/register")
    public String registerPage(Model model) {
        model.addAttribute("roles", User.UserRole.values());
        return "auth/register";
    }

    @PostMapping("/login")
    public String login(
            @RequestParam String email,
            @RequestParam String password,
            HttpSession session,
            Model model) {
        User user = userService.findByEmail(email).orElse(null);
        if (user != null && user.getPassword() != null && user.getPassword().equals(password)) {
            session.setAttribute("user", user);
            return "redirect:/dashboard";
        }
        model.addAttribute("error", "Invalid email or password");
        return "auth/login";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }

    @GetMapping("/auth/logout")
    public String logoutAlias(HttpSession session) {
        return logout(session);
    }

    @PostMapping("/auth/register")
    public String registerUser(
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String department,
            @RequestParam User.UserRole role,
            Model model) {
        
        try {
            User user = new User();
            user.setEmail(email);
 user.setPassword(password);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setDepartment(department);
            user.setRole(role);
            
            userService.registerUser(user);
            model.addAttribute("message", "Registration successful! Please login.");
            return "redirect:/auth/login";
        } catch (Exception e) {
            model.addAttribute("error", "Registration failed: " + e.getMessage());
            return "auth/register";
        }
    }
}
