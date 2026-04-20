package com.skillswap.controller;

import com.skillswap.entity.Session;
import com.skillswap.entity.Skill;
import com.skillswap.entity.MentorRating;
import com.skillswap.entity.Notification;
import com.skillswap.entity.Request;
import com.skillswap.entity.User;
import com.skillswap.service.MentorRatingService;
import com.skillswap.service.NotificationService;
import com.skillswap.service.RequestService;
import com.skillswap.service.SkillService;
import com.skillswap.service.SessionService;
import com.skillswap.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.Duration;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/sessions")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @Autowired
    private UserService userService;

    @Autowired
    private SkillService skillService;

    @Autowired
    private RequestService requestService;

    @Autowired
    private MentorRatingService mentorRatingService;

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/my-sessions")
    public String mySessions(HttpSession session, Model model) {
        User user = (session.getAttribute("user") instanceof User u) ? u : null;
        model.addAttribute("currentUser", user);
        model.addAttribute("sessions", user != null
                ? sessionService.findUpcomingSessions(user.getUserId())
                : List.of());

        if (user != null && user.getRole() == User.UserRole.MENTOR) {
            List<Request> mentorRequests = requestService.findByMentorId(user.getUserId());
            Map<Skill, List<Request>> mentorSkillGroups = new LinkedHashMap<>();
            for (Request request : mentorRequests) {
                mentorSkillGroups.computeIfAbsent(request.getSkillToLearn(), k -> new java.util.ArrayList<>())
                        .add(request);
            }
            model.addAttribute("mentorSkillGroups", mentorSkillGroups);
        }

        if (user != null && user.getRole() == User.UserRole.MENTEE) {
            List<Request> menteeRequests = requestService.findByMenteeId(user.getUserId());
            model.addAttribute("menteeSkillRequests", menteeRequests);
            Map<Long, Double> averageRatingsByRequest = new HashMap<>();
            Map<Long, Session> sessionByRequestId = new HashMap<>();
            for (Request req : menteeRequests) {
                averageRatingsByRequest.put(
                        req.getRequestId(),
                        mentorRatingService.getAverageForMentorAndSkill(
                                req.getMentor().getUserId(),
                                req.getSkillToLearn().getSkillId()));
                sessionService.findByRequestId(req.getRequestId())
                        .ifPresent(sess -> sessionByRequestId.put(req.getRequestId(), sess));
            }
            model.addAttribute("averageRatingsByRequest", averageRatingsByRequest);
            model.addAttribute("sessionByRequestId", sessionByRequestId);
        }

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

    @GetMapping("/my-sessions/skill/{skillId}")
    public String mentorSkillMentees(
            @PathVariable Long skillId,
            HttpSession session,
            Model model) {
        User user = (session.getAttribute("user") instanceof User u) ? u : null;
        if (user == null || user.getRole() != User.UserRole.MENTOR) {
            return "redirect:/sessions/my-sessions";
        }

        Skill skill = skillService.findById(skillId).orElse(null);
        if (skill == null) {
            return "redirect:/sessions/my-sessions";
        }

        List<Request> requestsForSkill = requestService.findByMentorId(user.getUserId())
                .stream()
                .filter(r -> r.getSkillToLearn() != null && r.getSkillToLearn().getSkillId().equals(skillId))
                .collect(Collectors.toList());
        Map<Long, Session> sessionByRequestId = new HashMap<>();
        for (Request req : requestsForSkill) {
            sessionService.findByRequestId(req.getRequestId())
                    .ifPresent(sess -> sessionByRequestId.put(req.getRequestId(), sess));
        }

        model.addAttribute("currentUser", user);
        model.addAttribute("skill", skill);
        model.addAttribute("requestsForSkill", requestsForSkill);
        model.addAttribute("sessionByRequestId", sessionByRequestId);
        return "sessions/skill-mentees";
    }

    @PostMapping("/my-sessions/slot/create")
    public String createSlotForMentee(
            @RequestParam Long requestId,
            @RequestParam String startDateTime,
            @RequestParam Integer durationMinutes,
            @RequestParam(defaultValue = "IN_PERSON") String sessionMode,
            HttpSession session) {
        User user = (session.getAttribute("user") instanceof User u) ? u : null;
        if (user == null || user.getRole() != User.UserRole.MENTOR) {
            return "redirect:/sessions/my-sessions";
        }

        Request request = requestService.findById(requestId).orElse(null);
        if (request == null || !request.getMentor().getUserId().equals(user.getUserId())) {
            return "redirect:/sessions/my-sessions";
        }

        if (request.getStatus() != Request.RequestStatus.ACCEPTED
                && request.getStatus() != Request.RequestStatus.COMPLETED) {
            return "redirect:/sessions/my-sessions/skill/" + request.getSkillToLearn().getSkillId();
        }

        int safeMinutes = Math.max(15, Math.min(480, durationMinutes == null ? 60 : durationMinutes));
        LocalDateTime start = LocalDateTime.parse(startDateTime, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        Session existing = sessionService.findByRequestId(requestId).orElse(null);
        if (existing == null) {
            existing = new Session();
            existing.setRequest(request);
            existing.setMentee(request.getMentee());
            existing.setMentor(request.getMentor());
        }

        Session.SessionMode safeMode;
        try {
            safeMode = Session.SessionMode.valueOf(sessionMode);
        } catch (IllegalArgumentException ex) {
            safeMode = Session.SessionMode.IN_PERSON;
        }
        sessionService.createOrUpdateSlotForRequest(existing, start, Duration.ofMinutes(safeMinutes), safeMode);

        String modeLabel = safeMode == Session.SessionMode.VIDEO_VISIT ? "Video Visit" : "In Person";
        notificationService.notifyUser(
                request.getMentee(),
                "New session slot proposed",
                "Mentor proposed a " + modeLabel + " slot for " + request.getSkillToLearn().getSkillName() + ".",
                Notification.NotificationType.SESSION_SCHEDULED,
                request.getRequestId());

        return "redirect:/sessions/my-sessions/skill/" + request.getSkillToLearn().getSkillId();
    }

    @PostMapping("/my-sessions/slot/{sessionId}/accept")
    public String acceptSlotByMentee(@PathVariable Long sessionId, HttpSession session) {
        User user = (session.getAttribute("user") instanceof User u) ? u : null;
        if (user == null || user.getRole() != User.UserRole.MENTEE) {
            return "redirect:/sessions/my-sessions";
        }

        Session sess = sessionService.findById(sessionId).orElse(null);
        if (sess == null || !sess.getMentee().getUserId().equals(user.getUserId())) {
            return "redirect:/sessions/my-sessions";
        }

        if (sess.getStatus() == Session.SessionStatus.PENDING_MENTEE_CONFIRMATION) {
            Session updated = sessionService.acceptByMentee(sessionId);
            notificationService.notifyUser(
                    updated.getMentor(),
                    "Session slot accepted",
                    updated.getMentee().getFirstName() + " accepted your proposed slot.",
                    Notification.NotificationType.SESSION_UPDATED,
                    updated.getSessionId());
        }
        return "redirect:/sessions/my-sessions";
    }

    @PostMapping("/my-sessions/slot/{sessionId}/reject")
    public String rejectSlotByMentee(@PathVariable Long sessionId, HttpSession session) {
        User user = (session.getAttribute("user") instanceof User u) ? u : null;
        if (user == null || user.getRole() != User.UserRole.MENTEE) {
            return "redirect:/sessions/my-sessions";
        }

        Session sess = sessionService.findById(sessionId).orElse(null);
        if (sess == null || !sess.getMentee().getUserId().equals(user.getUserId())) {
            return "redirect:/sessions/my-sessions";
        }

        if (sess.getStatus() == Session.SessionStatus.PENDING_MENTEE_CONFIRMATION) {
            Session updated = sessionService.rejectByMentee(sessionId);
            notificationService.notifyUser(
                    updated.getMentor(),
                    "Session slot rejected",
                    updated.getMentee().getFirstName() + " rejected your proposed slot.",
                    Notification.NotificationType.SESSION_UPDATED,
                    updated.getSessionId());
        }
        return "redirect:/sessions/my-sessions";
    }

    @PostMapping("/my-sessions/skill/{skillId}/delete")
    public String deleteMentorSkill(
            @PathVariable Long skillId,
            HttpSession session) {
        User user = (session.getAttribute("user") instanceof User u) ? u : null;
        if (user == null || user.getRole() != User.UserRole.MENTOR) {
            return "redirect:/sessions/my-sessions";
        }

        Skill skill = skillService.findById(skillId).orElse(null);
        if (skill == null || skill.getCreatedByMentor() == null
                || !skill.getCreatedByMentor().getUserId().equals(user.getUserId())) {
            return "redirect:/sessions/my-sessions";
        }

        skillService.deleteSkillCompletely(skillId);
        return "redirect:/sessions/my-sessions";
    }

    @PostMapping("/rate-mentor")
    public String rateMentor(
            @RequestParam Long requestId,
            @RequestParam Integer rating,
            @RequestParam(required = false) String comment,
            HttpSession session) {
        User user = (session.getAttribute("user") instanceof User u) ? u : null;
        if (user == null || user.getRole() != User.UserRole.MENTEE) {
            return "redirect:/sessions/my-sessions";
        }

        Request request = requestService.findById(requestId).orElse(null);
        if (request == null || !request.getMentee().getUserId().equals(user.getUserId())) {
            return "redirect:/sessions/my-sessions";
        }
        if (request.getStatus() != Request.RequestStatus.ACCEPTED
                && request.getStatus() != Request.RequestStatus.COMPLETED) {
            return "redirect:/sessions/my-sessions";
        }

        int safeRating = Math.max(1, Math.min(5, rating));
        MentorRating existing = mentorRatingService.findByMentorMenteeSkill(
                request.getMentor().getUserId(),
                user.getUserId(),
                request.getSkillToLearn().getSkillId());

        MentorRating mentorRating = existing != null ? existing : new MentorRating();
        mentorRating.setMentor(request.getMentor());
        mentorRating.setMentee(user);
        mentorRating.setSkill(request.getSkillToLearn());
        mentorRating.setRating(safeRating);
        mentorRating.setComment(comment);
        mentorRatingService.createOrUpdate(mentorRating);

        return "redirect:/sessions/my-sessions";
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
            skill.setCreatedByMentor(user);
            Skill createdSkill = skillService.createSkill(skill);

            for (User mentee : userService.findByRole(User.UserRole.MENTEE)) {
                if (mentee != null && Boolean.TRUE.equals(mentee.getIsActive())) {
                    notificationService.notifyUser(
                            mentee,
                            "New skill added",
                            user.getFirstName() + " added a new skill: " + createdSkill.getSkillName() + ".",
                            Notification.NotificationType.SKILL_CREATED,
                            createdSkill.getSkillId());
                }
            }
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
    public String completeSession(@PathVariable Long sessionId, HttpSession session) {
        User actor = (session.getAttribute("user") instanceof User u) ? u : null;
        Session updated = sessionService.completeSession(sessionId);
        User recipient = actor != null && updated.getMentor().getUserId().equals(actor.getUserId())
                ? updated.getMentee()
                : updated.getMentor();
        notificationService.notifyUser(
                recipient,
                "Session completed",
                "Session for " + updated.getRequest().getSkillToLearn().getSkillName() + " was marked as completed.",
                Notification.NotificationType.SESSION_COMPLETED,
                updated.getSessionId());
        return "redirect:/sessions/my-sessions";
    }

    @PostMapping("/{sessionId}/reschedule")
    public String rescheduleSession(
            @PathVariable Long sessionId,
            @RequestParam String newStart,
            @RequestParam String newEnd,
            HttpSession session) {
        User actor = (session.getAttribute("user") instanceof User u) ? u : null;
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime start = LocalDateTime.parse(newStart, formatter);
        LocalDateTime end = LocalDateTime.parse(newEnd, formatter);
        Session updated = sessionService.rescheduleSession(sessionId, start, end);
        User recipient = actor != null && updated.getMentor().getUserId().equals(actor.getUserId())
                ? updated.getMentee()
                : updated.getMentor();
        notificationService.notifyUser(
                recipient,
                "Session rescheduled",
                "Session for " + updated.getRequest().getSkillToLearn().getSkillName() + " was rescheduled.",
                Notification.NotificationType.SESSION_UPDATED,
                updated.getSessionId());
        return "redirect:/sessions/my-sessions";
    }

    @PostMapping("/{sessionId}/cancel")
    public String cancelSession(@PathVariable Long sessionId, HttpSession session) {
        User actor = (session.getAttribute("user") instanceof User u) ? u : null;
        Session updated = sessionService.cancelSession(sessionId);
        User recipient = actor != null && updated.getMentor().getUserId().equals(actor.getUserId())
                ? updated.getMentee()
                : updated.getMentor();
        notificationService.notifyUser(
                recipient,
                "Session cancelled",
                "Session for " + updated.getRequest().getSkillToLearn().getSkillName() + " was cancelled.",
                Notification.NotificationType.SESSION_UPDATED,
                updated.getSessionId());
        return "redirect:/sessions/my-sessions";
    }
}
