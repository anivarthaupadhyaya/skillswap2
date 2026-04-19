package com.skillswap.repository;

import com.skillswap.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserUserId(Long userId);
    List<Notification> findByUserUserIdAndIsReadFalse(Long userId);
    List<Notification> findByUserUserIdOrderByCreatedAtDesc(Long userId);
}
