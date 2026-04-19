package com.skillswap.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuppressWarnings("all")
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @ManyToOne
    @JoinColumn(name = "mentee_id", nullable = false)
    private User mentee;

    @ManyToOne
    @JoinColumn(name = "mentor_id", nullable = false)
    private User mentor;

    @ManyToOne
    @JoinColumn(name = "skill_to_learn_id", nullable = false)
    private Skill skillToLearn;

    @ManyToOne
    @JoinColumn(name = "skill_to_teach_id", nullable = false)
    private Skill skillToTeach;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PROPOSED;

    @Column(nullable = false)
    private LocalDateTime requestedAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(length = 500)
    private String message;

    private LocalDateTime respondedAt;

    private String declineReason;

    public enum RequestStatus {
        PROPOSED, ACCEPTED, DECLINED, RESCHEDULED, COMPLETED
    }
}
