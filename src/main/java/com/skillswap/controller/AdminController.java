package com.skillswap.controller;

import com.skillswap.entity.Skill;
import com.skillswap.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.util.HashSet;
import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private SkillService skillService;

    @GetMapping("/dashboard")
    public String adminDashboard() {
        return "admin/dashboard";
    }

    @GetMapping("/taxonomy")
    public String manageTaxonomy(Model model) {
        return "admin/taxonomy";
    }

    @GetMapping("/taxonomy/new")
    public String newTaxonomy() {
        return "admin/taxonomy-form";
    }

    @PostMapping("/taxonomy")
    public String createTaxonomy(
            @RequestParam String categoryName,
            @RequestParam String description) {
        return "redirect:/admin/taxonomy";
    }

    @GetMapping("/skills")
    public String manageSkills(Model model) {
        model.addAttribute("skills", skillService.findAllSkills());
        return "admin/skills";
    }

    @GetMapping("/skills/new")
    public String newSkill(Model model) {
        model.addAttribute("categories", Skill.SkillCategory.values());
        return "admin/skill-form";
    }

    @PostMapping("/skills")
    public String createSkill(
            @RequestParam String skillName,
            @RequestParam String description,
            @RequestParam(name = "categories") List<Skill.SkillCategory> categories,
            Model model) {
        try {
            Skill skill = new Skill();
            skill.setSkillName(skillName);
            skill.setDescription(description);
            skill.setCategories(new HashSet<>(categories));
            skillService.createSkill(skill);
            return "redirect:/admin/skills";
        } catch (Exception e) {
            model.addAttribute("error", "Error creating skill: " + e.getMessage());
        }
        return "admin/skill-form";
    }

    @PostMapping("/skills/{skillId}/deactivate")
    public String deactivateSkill(@PathVariable Long skillId) {
        skillService.deactivateSkill(skillId);
        return "redirect:/admin/skills";
    }
}
