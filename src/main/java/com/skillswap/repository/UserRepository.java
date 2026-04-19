package com.skillswap.repository;

import com.skillswap.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    @EntityGraph(attributePaths = "skills")
    Optional<User> findByUserId(Long userId);
    Optional<User> findFirstByRoleAndIsActiveTrue(User.UserRole role);
    List<User> findByRole(User.UserRole role);
    List<User> findByDepartment(String department);
    List<User> findByIsActiveTrue();
    boolean existsByEmail(String email);
}
