package com.skillswap.service;

import com.skillswap.entity.Skill;
import com.skillswap.repository.FeedbackRepository;
import com.skillswap.repository.RequestRepository;
import com.skillswap.repository.SessionRepository;
import com.skillswap.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SkillService {
    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

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
        return skillRepository.findByCategoriesContaining(category);
    }

    public List<Skill> findAllActiveSkills() {
        return skillRepository.findByIsActiveTrue();
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

    @Transactional
    public void deleteSkillCompletely(Long skillId) {
        List<Long> requestIds = requestRepository.findBySkillToLearnSkillId(skillId)
                .stream()
                .map(r -> r.getRequestId())
                .collect(Collectors.toList());

        if (!requestIds.isEmpty()) {
            List<Long> sessionIds = sessionRepository.findByRequestRequestIdIn(requestIds)
                    .stream()
                    .map(s -> s.getSessionId())
                    .collect(Collectors.toList());

            if (!sessionIds.isEmpty()) {
                feedbackRepository.deleteBySessionSessionIdIn(sessionIds);
                sessionRepository.deleteAllById(sessionIds);
            }

            requestRepository.deleteAllById(requestIds);
        }

        skillRepository.deleteUserSkillLinks(skillId);
        skillRepository.deleteSkillCategories(skillId);
        skillRepository.deleteById(skillId);
    }
}
