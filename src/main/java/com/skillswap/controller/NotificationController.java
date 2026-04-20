package com.skillswap.controller;

import com.skillswap.entity.User;
import com.skillswap.service.NotificationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public String notifications(HttpSession session, Model model) {
        User user = (session.getAttribute("user") instanceof User u) ? u : null;
        if (user == null) {
            return "redirect:/auth/login";
        }
        model.addAttribute("currentUser", user);
        model.addAttribute("notifications", notificationService.findUserNotificationsOrderByDate(user.getUserId()));
        model.addAttribute("unreadCount", notificationService.findUnreadNotificationsForUser(user.getUserId()).size());
        return "notifications/list";
    }

    @PostMapping("/{notificationId}/read")
    public String markRead(@PathVariable Long notificationId, HttpSession session) {
        User user = (session.getAttribute("user") instanceof User u) ? u : null;
        if (user == null) {
            return "redirect:/auth/login";
        }
        notificationService.markAsRead(notificationId);
        return "redirect:/notifications";
    }

    @PostMapping("/read-all")
    public String markAllRead(HttpSession session) {
        User user = (session.getAttribute("user") instanceof User u) ? u : null;
        if (user == null) {
            return "redirect:/auth/login";
        }
        notificationService.markAllAsRead(user.getUserId());
        return "redirect:/notifications";
    }
}

