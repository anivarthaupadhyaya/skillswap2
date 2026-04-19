package com.skillswap.controller;

import com.skillswap.entity.Session;
import com.skillswap.entity.User;
import com.skillswap.service.SessionService;
import com.skillswap.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Controller
@RequestMapping("/sessions")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @Autowired
    private UserService userService;

    @GetMapping("/my-sessions")
    public String mySessions(HttpSession session, Model model) {
        User user = (session.getAttribute("user") instanceof User u) ? u : null;
        if (user != null) {
            model.addAttribute("sessions", sessionService.findUpcomingSessions(user.getUserId()));
        }
        return "sessions/my-sessions";
    }

    @GetMapping("/{sessionId}")
    public String sessionDetail(@PathVariable Long sessionId, Model model) {
        sessionService.findById(sessionId).ifPresent(session -> {
            model.addAttribute("session", session);
        });
        return "sessions/detail";
    }

    @PostMapping("/{sessionId}/complete")
    public String completeSession(@PathVariable Long sessionId) {
        sessionService.completeSession(sessionId);
        return "redirect:/sessions/my-sessions";
    }

    @PostMapping("/{sessionId}/reschedule")
    public String rescheduleSession(
            @PathVariable Long sessionId,
            @RequestParam String newStart,
            @RequestParam String newEnd) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime start = LocalDateTime.parse(newStart, formatter);
        LocalDateTime end = LocalDateTime.parse(newEnd, formatter);
        sessionService.rescheduleSession(sessionId, start, end);
        return "redirect:/sessions/my-sessions";
    }

    @PostMapping("/{sessionId}/cancel")
    public String cancelSession(@PathVariable Long sessionId) {
        sessionService.cancelSession(sessionId);
        return "redirect:/sessions/my-sessions";
    }
}
