package com.skillswap.service;

import com.skillswap.entity.User;
import com.skillswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(Long userId) {
        return userRepository.findById(userId);
    }

    public Optional<User> findByIdWithSkills(Long userId) {
        return userRepository.findByUserId(userId);
    }

    public List<User> findByRole(User.UserRole role) {
        return userRepository.findByRole(role);
    }

    public Optional<User> findFirstActiveByRole(User.UserRole role) {
        return userRepository.findFirstByRoleAndIsActiveTrue(role);
    }

    public List<User> findByDepartment(String department) {
        return userRepository.findByDepartment(department);
    }

    public List<User> getAllActiveUsers() {
        return userRepository.findByIsActiveTrue();
    }

    public User updateUser(User user) {
        user.setUpdatedAt(java.time.LocalDateTime.now());
        return userRepository.save(user);
    }

    public void deactivateUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            user.get().setIsActive(false);
            userRepository.save(user.get());
        }
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }
}
