package com.skillswap.repository;

import com.skillswap.entity.Skill;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    Optional<Skill> findBySkillName(String skillName);
    List<Skill> findByCategoriesContaining(Skill.SkillCategory category);
    List<Skill> findByIsActiveTrue();

    @Modifying
    @Query(value = "DELETE FROM user_skills WHERE skill_id = ?1", nativeQuery = true)
    void deleteUserSkillLinks(Long skillId);

    @Modifying
    @Query(value = "DELETE FROM skill_categories WHERE skill_id = ?1", nativeQuery = true)
    void deleteSkillCategories(Long skillId);
}
