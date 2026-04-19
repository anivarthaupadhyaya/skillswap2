package com.skillswap.service;

import com.skillswap.entity.SkillTaxonomy;
import com.skillswap.repository.SkillTaxonomyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SkillTaxonomyService {
    @Autowired
    private SkillTaxonomyRepository skillTaxonomyRepository;

    public SkillTaxonomy createTaxonomy(SkillTaxonomy taxonomy) {
        return skillTaxonomyRepository.save(taxonomy);
    }

    public Optional<SkillTaxonomy> findById(Long taxonomyId) {
        return skillTaxonomyRepository.findById(taxonomyId);
    }

    public Optional<SkillTaxonomy> findByCategoryName(String categoryName) {
        return skillTaxonomyRepository.findByCategoryName(categoryName);
    }

    public List<SkillTaxonomy> findAllActiveTaxonomies() {
        return skillTaxonomyRepository.findByIsActiveTrue();
    }

    public SkillTaxonomy updateTaxonomy(SkillTaxonomy taxonomy) {
        taxonomy.setUpdatedAt(java.time.LocalDateTime.now());
        return skillTaxonomyRepository.save(taxonomy);
    }

    public void deactivateTaxonomy(Long taxonomyId) {
        skillTaxonomyRepository.findById(taxonomyId).ifPresent(taxonomy -> {
            taxonomy.setIsActive(false);
            skillTaxonomyRepository.save(taxonomy);
        });
    }

    public List<SkillTaxonomy> findAllTaxonomies() {
        return skillTaxonomyRepository.findAll();
    }
}
