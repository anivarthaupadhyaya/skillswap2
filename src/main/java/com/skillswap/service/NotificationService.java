package com.skillswap.service;

import com.skillswap.entity.Notification;
import com.skillswap.entity.User;
import com.skillswap.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public Notification notifyUser(
            User user,
            String title,
            String message,
            Notification.NotificationType notificationType,
            Long relatedEntityId) {
        if (user == null) {
            return null;
        }
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setNotificationType(notificationType);
        notification.setRelatedEntityId(relatedEntityId);
        return notificationRepository.save(notification);
    }

    public Optional<Notification> findById(Long notificationId) {
        return notificationRepository.findById(notificationId);
    }

    public List<Notification> findByUserId(Long userId) {
        return notificationRepository.findByUserUserId(userId);
    }

    public List<Notification> findUnreadNotificationsForUser(Long userId) {
        return notificationRepository.findByUserUserIdAndIsReadFalse(userId);
    }

    public List<Notification> findUserNotificationsOrderByDate(Long userId) {
        return notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId);
    }

    public Notification markAsRead(Long notificationId) {
        Optional<Notification> notification = notificationRepository.findById(notificationId);
        if (notification.isPresent()) {
            notification.get().setIsRead(true);
            return notificationRepository.save(notification.get());
        }
        throw new RuntimeException("Notification not found");
    }

    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = 
            notificationRepository.findByUserUserIdAndIsReadFalse(userId);
        unreadNotifications.forEach(notification -> {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        });
    }

    public List<Notification> findAllNotifications() {
        return notificationRepository.findAll();
    }
}
