package com.skillswap.repository;

import com.skillswap.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByGivenByUserId(Long userId);
    List<Feedback> findByGivenToUserId(Long userId);
    List<Feedback> findBySessionSessionId(Long sessionId);
}
