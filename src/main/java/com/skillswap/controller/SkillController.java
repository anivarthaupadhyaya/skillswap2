package com.skillswap.controller;

import com.skillswap.entity.Skill;
import com.skillswap.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/skills")
public class SkillController {

    @Autowired
    private SkillService skillService;

    @GetMapping("/catalog")
    public String skillCatalog(
            @RequestParam(required = false) String category,
            Model model) {
        if (category != null && !category.isEmpty()) {
            model.addAttribute("skills", skillService.findByCategory(Skill.SkillCategory.valueOf(category)));
        } else {
            model.addAttribute("skills", skillService.findAllActiveSkills());
        }
        model.addAttribute("categories", Skill.SkillCategory.values());
        return "skills/catalog";
    }

    @GetMapping("/{skillId}")
    public String skillDetail(@PathVariable Long skillId, Model model) {
        skillService.findById(skillId).ifPresent(skill -> {
            model.addAttribute("skill", skill);
        });
        return "skills/detail";
    }
}
