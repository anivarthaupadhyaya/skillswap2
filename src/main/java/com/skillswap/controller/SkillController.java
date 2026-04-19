package com.skillswap.controller;

import com.skillswap.entity.Skill;
import com.skillswap.entity.Request;
import com.skillswap.entity.Notification;
import com.skillswap.entity.User;
import com.skillswap.service.NotificationService;
import com.skillswap.service.RequestService;
import com.skillswap.service.SkillService;
import com.skillswap.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/skills")
public class SkillController {

    @Autowired
    private SkillService skillService;

    @Autowired
    private UserService userService;

    @Autowired
    private RequestService requestService;

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/catalog")
    public String skillCatalog(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String msg,
            HttpSession session,
            Model model) {
        if (category != null && !category.isEmpty()) {
            model.addAttribute("skills", skillService.findByCategory(Skill.SkillCategory.valueOf(category)));
        } else {
            model.addAttribute("skills", skillService.findAllActiveSkills());
        }
        model.addAttribute("categories", Skill.SkillCategory.values());

        User currentUser = (session.getAttribute("user") instanceof User u) ? u : null;
        model.addAttribute("currentUser", currentUser);
        model.addAttribute("message", msg);
        if (currentUser != null) {
            Set<Long> registeredSkillIds = requestService.findByMenteeId(currentUser.getUserId())
                    .stream()
                    .filter(r -> r.getStatus() == Request.RequestStatus.PROPOSED
                            || r.getStatus() == Request.RequestStatus.ACCEPTED)
                    .map(r -> r.getSkillToLearn().getSkillId())
                    .collect(Collectors.toSet());
            model.addAttribute("registeredSkillIds", registeredSkillIds);
        }
        return "skills/catalog";
    }

    @PostMapping("/{skillId}/register")
    public String registerForSkill(@PathVariable Long skillId, HttpSession session) {
        User currentUser = (session.getAttribute("user") instanceof User u) ? u : null;
        if (currentUser == null || currentUser.getRole() != User.UserRole.MENTEE) {
            return "redirect:/skills/catalog?msg=Login%20as%20a%20mentee%20to%20register";
        }

        Skill skill = skillService.findById(skillId).orElse(null);
        if (skill == null) {
            return "redirect:/skills/catalog?msg=Skill%20not%20found";
        }

        User mentor = skill.getCreatedByMentor();
        if (mentor == null) {
            mentor = userService.findFirstActiveByRole(User.UserRole.MENTOR).orElse(null);
            if (mentor == null) {
                return "redirect:/skills/catalog?msg=No%20mentor%20available%20for%20this%20skill";
            }
            skill.setCreatedByMentor(mentor);
            skillService.updateSkill(skill);
        }

        final Long mentorId = mentor.getUserId();
        boolean alreadyRequested = requestService.findByMenteeId(currentUser.getUserId()).stream()
                .anyMatch(r -> r.getMentor().getUserId().equals(mentorId)
                        && r.getSkillToLearn().getSkillId().equals(skillId)
                        && (r.getStatus() == Request.RequestStatus.PROPOSED
                            || r.getStatus() == Request.RequestStatus.ACCEPTED));

        if (!alreadyRequested) {
            Request request = new Request();
            request.setMentee(currentUser);
            request.setMentor(mentor);
            request.setSkillToLearn(skill);
            request.setSkillToTeach(skill);
            request.setMessage("I would like to learn this skill.");
            Request created = requestService.createRequest(request);

            Notification notification = new Notification();
            notification.setUser(mentor);
            notification.setTitle("New skill request");
            notification.setMessage(currentUser.getFirstName() + " requested to learn " + skill.getSkillName() + ".");
            notification.setNotificationType(Notification.NotificationType.REQUEST_RECEIVED);
            notification.setRelatedEntityId(created.getRequestId());
            notificationService.createNotification(notification);
            return "redirect:/skills/catalog?msg=Request%20sent%20to%20mentor";
        }

        return "redirect:/skills/catalog?msg=Request%20already%20sent%20for%20this%20skill";
    }

    @GetMapping("/{skillId}")
    public String skillDetail(@PathVariable Long skillId, Model model) {
        skillService.findById(skillId).ifPresent(skill -> {
            model.addAttribute("skill", skill);
        });
        return "skills/detail";
    }
}
