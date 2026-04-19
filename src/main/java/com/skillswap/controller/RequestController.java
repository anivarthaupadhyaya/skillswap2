package com.skillswap.controller;

import com.skillswap.entity.Request;
import com.skillswap.entity.User;
import com.skillswap.service.RequestService;
import com.skillswap.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@Controller
@RequestMapping("/requests")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @Autowired
    private UserService userService;

    @GetMapping("/my-requests")
    public String myRequests(Principal principal, Model model) {
        User user = userService.findByEmail(principal.getName()).orElse(null);
        if (user != null) {
            if (user.getRole() == User.UserRole.MENTEE) {
                model.addAttribute("requests", requestService.findByMenteeId(user.getUserId()));
            } else if (user.getRole() == User.UserRole.MENTOR) {
                model.addAttribute("requests", requestService.findByMentorId(user.getUserId()));
            }
        }
        return "requests/my-requests";
    }

    @GetMapping("/pending")
    public String pendingRequests(Principal principal, Model model) {
        User user = userService.findByEmail(principal.getName()).orElse(null);
        if (user != null && user.getRole() == User.UserRole.MENTOR) {
            model.addAttribute("requests", requestService.findPendingRequestsForMentor(user.getUserId()));
        }
        return "requests/pending";
    }

    @GetMapping("/{requestId}")
    public String requestDetail(@PathVariable Long requestId, Model model) {
        requestService.findById(requestId).ifPresent(request -> {
            model.addAttribute("request", request);
        });
        return "requests/detail";
    }

    @PostMapping("/{requestId}/accept")
    public String acceptRequest(@PathVariable Long requestId) {
        requestService.acceptRequest(requestId);
        return "redirect:/requests/pending";
    }

    @PostMapping("/{requestId}/decline")
    public String declineRequest(
            @PathVariable Long requestId,
            @RequestParam String reason) {
        requestService.declineRequest(requestId, reason);
        return "redirect:/requests/pending";
    }

    @GetMapping("/new")
    public String createRequestPage(Model model) {
        return "requests/create";
    }
}
