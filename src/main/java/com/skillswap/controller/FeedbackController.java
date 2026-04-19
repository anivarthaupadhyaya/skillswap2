package com.skillswap.controller;

import com.skillswap.entity.Feedback;
import com.skillswap.entity.User;
import com.skillswap.service.FeedbackService;
import com.skillswap.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@Controller
@RequestMapping("/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private UserService userService;

    @GetMapping("/{sessionId}")
    public String feedbackPage(@PathVariable Long sessionId, Model model) {
        model.addAttribute("sessionId", sessionId);
        return "feedback/create";
    }

    @PostMapping("/submit")
    public String submitFeedback(
            @RequestParam Long sessionId,
            @RequestParam Integer rating,
            @RequestParam String comment,
            @RequestParam Integer skillRating,
            @RequestParam Integer communicationRating,
            @RequestParam Long givenToUserId,
            Principal principal,
            Model model) {
        try {
            User givenBy = userService.findByEmail(principal.getName()).orElse(null);
            User givenTo = userService.findById(givenToUserId).orElse(null);

            if (givenBy != null && givenTo != null) {
                Feedback feedback = new Feedback();
                feedback.setRating(rating);
                feedback.setComment(comment);
                feedback.setSkillDevelopmentRating(skillRating);
                feedback.setCommunicationRating(communicationRating);
                feedback.setGivenBy(givenBy);
                feedback.setGivenTo(givenTo);
                
                feedbackService.createFeedback(feedback);
                model.addAttribute("message", "Feedback submitted successfully!");
                return "redirect:/dashboard";
            }
        } catch (Exception e) {
            model.addAttribute("error", "Error submitting feedback: " + e.getMessage());
        }
        return "feedback/create";
    }

    @GetMapping("/received")
    public String receivedFeedback(Principal principal, Model model) {
        User user = userService.findByEmail(principal.getName()).orElse(null);
        if (user != null) {
            model.addAttribute("feedbacks", feedbackService.findByGivenTo(user.getUserId()));
            model.addAttribute("averageRating", feedbackService.getAverageRatingForUser(user.getUserId()));
        }
        return "feedback/received";
    }
}
