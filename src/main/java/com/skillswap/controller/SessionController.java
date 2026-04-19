package com.skillswap.controller;

import com.skillswap.entity.Session;
import com.skillswap.entity.Skill;
import com.skillswap.entity.User;
import com.skillswap.service.SkillService;
import com.skillswap.service.SessionService;
import com.skillswap.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;

@Controller
@RequestMapping("/sessions")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @Autowired
    private UserService userService;

    @Autowired
    private SkillService skillService;

    @GetMapping("/my-sessions")
    public String mySessions(HttpSession session, Model model) {
        User user = (session.getAttribute("user") instanceof User u) ? u : null;
        model.addAttribute("currentUser", user);
        model.addAttribute("sessions", user != null
                ? sessionService.findUpcomingSessions(user.getUserId())
                : List.of());
        return "sessions/my-sessions";
    }

    @GetMapping("/my-sessions/new-skill")
    public String newSkillFromSessions(HttpSession session, Model model) {
        User user = (session.getAttribute("user") instanceof User u) ? u : null;
        if (user == null || user.getRole() != User.UserRole.MENTOR) {
            return "redirect:/sessions/my-sessions";
        }
        model.addAttribute("categories", Skill.SkillCategory.values());
        return "sessions/new-skill";
    }

    @PostMapping("/my-sessions/new-skill")
    public String createSkillFromSessions(
            @RequestParam String skillName,
            @RequestParam String description,
            @RequestParam Skill.SkillCategory category,
            HttpSession session,
            Model model) {
        User user = (session.getAttribute("user") instanceof User u) ? u : null;
        if (user == null || user.getRole() != User.UserRole.MENTOR) {
            return "redirect:/sessions/my-sessions";
        }

        try {
            Skill skill = new Skill();
            skill.setSkillName(skillName);
            skill.setDescription(description);
            skill.setCategories(Set.of(category));
            skillService.createSkill(skill);
            return "redirect:/skills/catalog";
        } catch (Exception e) {
            model.addAttribute("error", "Could not create skill: " + e.getMessage());
            model.addAttribute("categories", Skill.SkillCategory.values());
            return "sessions/new-skill";
        }
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
