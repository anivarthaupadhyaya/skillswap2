package com.skillswap.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuppressWarnings("all")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String message;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private NotificationType notificationType;

    @Column(nullable = false)
    private Boolean isRead = false;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private Long relatedEntityId;

    public enum NotificationType {
        REQUEST_RECEIVED, REQUEST_SENT, REQUEST_ACCEPTED, REQUEST_DECLINED,
        SKILL_CREATED, CHAT_RECEIVED,
        SESSION_SCHEDULED, SESSION_UPDATED, SESSION_COMPLETED, FEEDBACK_RECEIVED, SYSTEM_ALERT
    }
}
