package com.skillswap.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "skill_taxonomy")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuppressWarnings("all")
public class SkillTaxonomy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long taxonomyId;

    @Column(nullable = false, unique = true)
    private String categoryName;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdByAdmin;
}
