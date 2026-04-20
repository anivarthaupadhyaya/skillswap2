package com.skillswap.controller;

import com.skillswap.entity.User;
import com.skillswap.service.NotificationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@ControllerAdvice
public class GlobalModelAttributesAdvice {

    @Autowired
    private NotificationService notificationService;

    @ModelAttribute("unreadCount")
    public Integer unreadCount(HttpSession session) {
        User user = (session.getAttribute("user") instanceof User u) ? u : null;
        if (user == null) {
            return 0;
        }
        return notificationService.findUnreadNotificationsForUser(user.getUserId()).size();
    }
}

