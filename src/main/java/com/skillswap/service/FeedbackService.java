package com.skillswap.service;

import com.skillswap.entity.Feedback;
import com.skillswap.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;

    public Feedback createFeedback(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    public Optional<Feedback> findById(Long feedbackId) {
        return feedbackRepository.findById(feedbackId);
    }

    public List<Feedback> findByGivenBy(Long userId) {
        return feedbackRepository.findByGivenByUserId(userId);
    }

    public List<Feedback> findByGivenTo(Long userId) {
        return feedbackRepository.findByGivenToUserId(userId);
    }

    public List<Feedback> findBySession(Long sessionId) {
        return feedbackRepository.findBySessionSessionId(sessionId);
    }

    public Double getAverageRatingForUser(Long userId) {
        List<Feedback> feedbacks = feedbackRepository.findByGivenToUserId(userId);
        return feedbacks.stream()
            .mapToInt(Feedback::getRating)
            .average()
            .orElse(0.0);
    }

    public List<Feedback> findAllFeedbacks() {
        return feedbackRepository.findAll();
    }
}
