package com.skillswap.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuppressWarnings("all")
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedbackId;

    @OneToOne
    @JoinColumn(name = "session_id", nullable = false, unique = true)
    private Session session;

    @ManyToOne
    @JoinColumn(name = "given_by_id", nullable = false)
    private User givenBy;

    @ManyToOne
    @JoinColumn(name = "given_to_id", nullable = false)
    private User givenTo;

    @Column(nullable = false)
    private Integer rating; // 1-5 scale

    @Column(nullable = false, length = 1000)
    private String comment;

    @Column(nullable = false)
    private Integer skillDevelopmentRating; // 1-5 scale

    @Column(nullable = false)
    private Integer communicationRating; // 1-5 scale

    @Column(nullable = false)
    private LocalDateTime feedbackDate = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
}
