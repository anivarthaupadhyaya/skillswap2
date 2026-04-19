package com.skillswap.service;

import com.skillswap.entity.Skill;
import com.skillswap.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SkillService {
    @Autowired
    private SkillRepository skillRepository;

    public Skill createSkill(Skill skill) {
        return skillRepository.save(skill);
    }

    public Optional<Skill> findById(Long skillId) {
        return skillRepository.findById(skillId);
    }

    public Optional<Skill> findBySkillName(String skillName) {
        return skillRepository.findBySkillName(skillName);
    }

    public List<Skill> findByCategory(Skill.SkillCategory category) {
        return skillRepository.findByCategory(category);
    }

    public List<Skill> findAllActiveSkills() {
        return skillRepository.findByIsActiveTrue();
    }

    public List<Skill> findByTaxonomy(Long taxonomyId) {
        return skillRepository.findByTaxonomyTaxonomyId(taxonomyId);
    }

    public Skill updateSkill(Skill skill) {
        skill.setUpdatedAt(java.time.LocalDateTime.now());
        return skillRepository.save(skill);
    }

    public void deactivateSkill(Long skillId) {
        skillRepository.findById(skillId).ifPresent(skill -> {
            skill.setIsActive(false);
            skillRepository.save(skill);
        });
    }

    public List<Skill> findAllSkills() {
        return skillRepository.findAll();
    }
}
