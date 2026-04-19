package com.skillswap.controller;

import com.skillswap.entity.Request;
import com.skillswap.entity.Notification;
import com.skillswap.entity.Session;
import com.skillswap.entity.User;
import com.skillswap.service.NotificationService;
import com.skillswap.service.RequestService;
import com.skillswap.service.SessionService;
import com.skillswap.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequestMapping("/requests")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private SessionService sessionService;

    @GetMapping("/my-requests")
    public String myRequests(HttpSession session, Model model) {
        User user = (session.getAttribute("user") instanceof User u) ? u : null;
        model.addAttribute("currentUser", user);
        if (user != null) {
            if (user.getRole() == User.UserRole.MENTEE) {
                model.addAttribute("requests", requestService.findByMenteeId(user.getUserId()));
            } else if (user.getRole() == User.UserRole.MENTOR) {
                model.addAttribute("requests", requestService.findByMentorId(user.getUserId()));
            } else {
                model.addAttribute("requests", List.of());
            }
        } else {
            model.addAttribute("requests", List.of());
        }
        return "requests/my-requests";
    }

    @GetMapping("/pending")
    public String pendingRequests(HttpSession session, Model model) {
        User user = (session.getAttribute("user") instanceof User u) ? u : null;
        model.addAttribute("currentUser", user);
        if (user != null && user.getRole() == User.UserRole.MENTOR) {
            model.addAttribute("requests", requestService.findPendingRequestsForMentor(user.getUserId()));
        } else {
            model.addAttribute("requests", List.of());
        }
        return "requests/my-requests";
    }

    @GetMapping("/{requestId}")
    public String requestDetail(@PathVariable Long requestId, HttpSession session, Model model) {
        User user = (session.getAttribute("user") instanceof User u) ? u : null;
        model.addAttribute("currentUser", user);
        requestService.findById(requestId).ifPresent(request -> {
            model.addAttribute("request", request);
        });
        return "requests/detail";
    }

    @PostMapping("/{requestId}/accept")
    public String acceptRequest(@PathVariable Long requestId) {
        Request accepted = requestService.acceptRequest(requestId);

        if (sessionService.findByRequestId(requestId).isEmpty()) {
            Session session = new Session();
            session.setRequest(accepted);
            session.setMentee(accepted.getMentee());
            session.setMentor(accepted.getMentor());
            session.setScheduledStart(LocalDateTime.now().plusDays(1));
            session.setScheduledEnd(LocalDateTime.now().plusDays(1).plusHours(1));
            sessionService.createSession(session);
        }

        Notification notification = new Notification();
        notification.setUser(accepted.getMentee());
        notification.setTitle("Request accepted");
        notification.setMessage("Your request for " + accepted.getSkillToLearn().getSkillName() + " was accepted.");
        notification.setNotificationType(Notification.NotificationType.REQUEST_ACCEPTED);
        notification.setRelatedEntityId(accepted.getRequestId());
        notificationService.createNotification(notification);

        return "redirect:/requests/my-requests";
    }

    @PostMapping("/{requestId}/decline")
    public String declineRequest(
            @PathVariable Long requestId,
            @RequestParam String reason) {
        Request declined = requestService.declineRequest(requestId, reason);

        Notification notification = new Notification();
        notification.setUser(declined.getMentee());
        notification.setTitle("Request declined");
        notification.setMessage("Your request for " + declined.getSkillToLearn().getSkillName() + " was declined.");
        notification.setNotificationType(Notification.NotificationType.REQUEST_DECLINED);
        notification.setRelatedEntityId(declined.getRequestId());
        notificationService.createNotification(notification);

        return "redirect:/requests/my-requests";
    }

    @GetMapping("/new")
    public String createRequestPage(Model model) {
        return "requests/create";
    }
}
