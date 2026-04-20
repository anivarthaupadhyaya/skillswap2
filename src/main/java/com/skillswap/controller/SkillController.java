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

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
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
        Skill.SkillCategory selectedCategory = null;
        List<Skill> selectedSkills;
        if (category != null && !category.isEmpty()) {
            selectedCategory = Skill.SkillCategory.valueOf(category);
            selectedSkills = skillService.findByCategory(selectedCategory);
        } else {
            selectedSkills = skillService.findAllActiveSkills();
        }

        Map<Skill.SkillCategory, List<Skill>> skillsByCategory = new LinkedHashMap<>();
        List<Skill> uncategorizedSkills = new ArrayList<>();
        for (Skill.SkillCategory skillCategory : Skill.SkillCategory.values()) {
            List<Skill> skillsInCategory = selectedSkills.stream()
                    .filter(s -> s.getCategories() != null && s.getCategories().contains(skillCategory))
                    .collect(Collectors.toCollection(ArrayList::new));
            if (!skillsInCategory.isEmpty()) {
                skillsByCategory.put(skillCategory, skillsInCategory);
            }
        }
        uncategorizedSkills = selectedSkills.stream()
                .filter(s -> s.getCategories() == null || s.getCategories().isEmpty())
                .collect(Collectors.toCollection(ArrayList::new));

        model.addAttribute("skillsByCategory", skillsByCategory);
        model.addAttribute("uncategorizedSkills", uncategorizedSkills);
        model.addAttribute("skills", selectedSkills);
        model.addAttribute("categories", Skill.SkillCategory.values());
        model.addAttribute("selectedCategory", selectedCategory);
        model.addAttribute("selectedCategorySkills", selectedCategory != null ? selectedSkills : List.of());

        List<Skill> allSkills = skillService.findAllActiveSkills();
        Map<Skill.SkillCategory, Integer> categoryCounts = new HashMap<>();
        Map<Skill.SkillCategory, List<String>> categoryPreviewNames = new HashMap<>();
        List<Map<String, Object>> categoryCards = new ArrayList<>();
        for (Skill.SkillCategory cat : Skill.SkillCategory.values()) {
            List<Skill> inCategory = allSkills.stream()
                    .filter(s -> s.getCategories() != null && s.getCategories().contains(cat))
                    .sorted(Comparator.comparing(Skill::getSkillName, String.CASE_INSENSITIVE_ORDER))
                    .collect(Collectors.toList());
            int count = inCategory.size();
            List<String> preview = inCategory.stream().limit(2).map(Skill::getSkillName).collect(Collectors.toList());
            categoryCounts.put(cat, count);
            categoryPreviewNames.put(cat, preview);

            Map<String, Object> card = new HashMap<>();
            card.put("enumName", cat.name());
            card.put("displayName", cat.getDisplayName());
            card.put("count", count);
            card.put("preview", preview);
            card.put("empty", count == 0);
            card.put("description", switch (cat) {
                case PHYSICAL_FITNESS ->
                        "Activities involving body movement, strength, endurance, or coordination like gym workouts, sports, yoga, running, martial arts, and dancing.";
                case CREATIVE_ARTISTIC ->
                        "Hobbies focused on creating or expressing ideas through music, art, writing, design, filmmaking, photography, or any imaginative activity.";
                case INTELLECTUAL_LEARNING ->
                        "Activities that stimulate thinking and knowledge growth like reading, coding, problem-solving, studying subjects, puzzles, strategy games, and research.";
                case SOCIAL_CONNECTION ->
                        "Hobbies involving interaction with others such as group activities, networking, clubs, events, conversations, team sports, and building relationships.";
                case RELAXATION_PASSIVE ->
                        "Low-effort activities meant for relaxation and enjoyment like watching movies, listening to music, casual gaming, scrolling, or simply unwinding.";
                case SPIRITUAL_INNER_GROWTH ->
                        "Practices that improve inner peace and self-awareness such as meditation, prayer, mindfulness, reflection, philosophy, and connecting with deeper purpose.";
                case EXPLORATION_ADVENTURE ->
                        "Activities involving new experiences and environments like traveling, hiking, camping, road trips, discovering places, and stepping outside comfort zones.";
                case COLLECTION_BUILDING ->
                        "Hobbies focused on collecting items or constructing things like collectibles, models, DIY projects, assembling kits, organizing, and creating tangible outcomes.";
            });
            categoryCards.add(card);
        }
        model.addAttribute("categoryCounts", categoryCounts);
        model.addAttribute("categoryPreviewNames", categoryPreviewNames);
        model.addAttribute("categoryCards", categoryCards);

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

            notificationService.notifyUser(
                    currentUser,
                    "Request sent",
                    "Your request for " + skill.getSkillName() + " was sent to " + mentor.getFirstName() + ".",
                    Notification.NotificationType.REQUEST_SENT,
                    created.getRequestId());
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
