package com.skillswap.controller;

import com.skillswap.entity.Skill;
import com.skillswap.entity.SkillTaxonomy;
import com.skillswap.service.SkillService;
import com.skillswap.service.SkillTaxonomyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private SkillTaxonomyService skillTaxonomyService;

    @Autowired
    private SkillService skillService;

    @GetMapping("/dashboard")
    public String adminDashboard() {
        return "admin/dashboard";
    }

    @GetMapping("/taxonomy")
    public String manageTaxonomy(Model model) {
        model.addAttribute("taxonomies", skillTaxonomyService.findAllTaxonomies());
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
        SkillTaxonomy taxonomy = new SkillTaxonomy();
        taxonomy.setCategoryName(categoryName);
        taxonomy.setDescription(description);
        skillTaxonomyService.createTaxonomy(taxonomy);
        return "redirect:/admin/taxonomy";
    }

    @GetMapping("/skills")
    public String manageSkills(Model model) {
        model.addAttribute("skills", skillService.findAllSkills());
        return "admin/skills";
    }

    @GetMapping("/skills/new")
    public String newSkill(Model model) {
        model.addAttribute("taxonomies", skillTaxonomyService.findAllTaxonomies());
        model.addAttribute("categories", Skill.SkillCategory.values());
        return "admin/skill-form";
    }

    @PostMapping("/skills")
    public String createSkill(
            @RequestParam String skillName,
            @RequestParam String description,
            @RequestParam Skill.SkillCategory category,
            @RequestParam Integer proficiencyLevel,
            @RequestParam Long taxonomyId,
            Model model) {
        try {
            SkillTaxonomy taxonomy = skillTaxonomyService.findById(taxonomyId).orElse(null);
            if (taxonomy != null) {
                Skill skill = new Skill();
                skill.setSkillName(skillName);
                skill.setDescription(description);
                skill.setCategory(category);
                skill.setProficiencyLevel(proficiencyLevel);
                skill.setTaxonomy(taxonomy);
                skillService.createSkill(skill);
                return "redirect:/admin/skills";
            }
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
