package com.skillswap.controller;

import com.skillswap.entity.Skill;
import com.skillswap.entity.User;
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

    @GetMapping("/catalog")
    public String skillCatalog(
            @RequestParam(required = false) String category,
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
        if (currentUser != null) {
            User userWithSkills = userService.findByIdWithSkills(currentUser.getUserId()).orElse(currentUser);
            Set<Long> registeredSkillIds = userWithSkills.getSkills()
                    .stream()
                    .map(Skill::getSkillId)
                    .collect(Collectors.toSet());
            model.addAttribute("registeredSkillIds", registeredSkillIds);
        }
        return "skills/catalog";
    }

    @PostMapping("/{skillId}/register")
    public String registerForSkill(@PathVariable Long skillId, HttpSession session) {
        User currentUser = (session.getAttribute("user") instanceof User u) ? u : null;
        if (currentUser == null || currentUser.getRole() != User.UserRole.MENTEE) {
            return "redirect:/skills/catalog";
        }

        User userWithSkills = userService.findByIdWithSkills(currentUser.getUserId()).orElse(null);
        if (userWithSkills == null) {
            return "redirect:/skills/catalog";
        }

        Skill skill = skillService.findById(skillId).orElse(null);
        if (skill == null) {
            return "redirect:/skills/catalog";
        }

        if (userWithSkills.getSkills().stream().noneMatch(s -> s.getSkillId().equals(skillId))) {
            userWithSkills.getSkills().add(skill);
            userService.updateUser(userWithSkills);
            session.setAttribute("user", userWithSkills);
        }

        return "redirect:/skills/catalog";
    }

    @GetMapping("/{skillId}")
    public String skillDetail(@PathVariable Long skillId, Model model) {
        skillService.findById(skillId).ifPresent(skill -> {
            model.addAttribute("skill", skill);
        });
        return "skills/detail";
    }
}
