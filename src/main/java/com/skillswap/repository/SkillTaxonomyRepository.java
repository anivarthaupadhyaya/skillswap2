package com.skillswap.repository;

import com.skillswap.entity.SkillTaxonomy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface SkillTaxonomyRepository extends JpaRepository<SkillTaxonomy, Long> {
    Optional<SkillTaxonomy> findByCategoryName(String categoryName);
    List<SkillTaxonomy> findByIsActiveTrue();
}
