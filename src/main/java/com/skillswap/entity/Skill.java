package com.skillswap.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "skills")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuppressWarnings("all")
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long skillId;

    @Column(nullable = false, unique = true)
    private String skillName;

    @Column(nullable = false)
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "skill_categories", joinColumns = @JoinColumn(name = "skill_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private Set<SkillCategory> categories = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "created_by_mentor_id")
    private User createdByMentor;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum SkillCategory {
        PHYSICAL_FITNESS,
        CREATIVE_ARTISTIC,
        INTELLECTUAL_LEARNING,
        SOCIAL_CONNECTION,
        RELAXATION_PASSIVE,
        SPIRITUAL_INNER_GROWTH,
        EXPLORATION_ADVENTURE,
        COLLECTION_BUILDING;

        public String getDisplayName() {
            return switch (this) {
                case PHYSICAL_FITNESS -> "Physical / Fitness";
                case CREATIVE_ARTISTIC -> "Creative / Artistic";
                case INTELLECTUAL_LEARNING -> "Intellectual / Learning";
                case SOCIAL_CONNECTION -> "Social / Connection";
                case RELAXATION_PASSIVE -> "Relaxation / Passive";
                case SPIRITUAL_INNER_GROWTH -> "Spiritual / Inner Growth";
                case EXPLORATION_ADVENTURE -> "Exploration / Adventure";
                case COLLECTION_BUILDING -> "Collection / Building";
            };
        }
    }

    @Transient
    public String getCategoriesDisplay() {
        if (categories == null || categories.isEmpty()) return "";
        return categories.stream()
                .map(SkillCategory::getDisplayName)
                .collect(Collectors.joining(", "));
    }
}
