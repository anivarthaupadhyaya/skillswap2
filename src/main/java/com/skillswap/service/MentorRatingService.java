package com.skillswap.service;

import com.skillswap.entity.MentorRating;
import com.skillswap.repository.MentorRatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MentorRatingService {
    @Autowired
    private MentorRatingRepository mentorRatingRepository;

    public MentorRating createOrUpdate(MentorRating rating) {
        rating.setUpdatedAt(LocalDateTime.now());
        return mentorRatingRepository.save(rating);
    }

    public MentorRating findByMentorMenteeSkill(Long mentorId, Long menteeId, Long skillId) {
        return mentorRatingRepository
                .findByMentorUserIdAndMenteeUserIdAndSkillSkillId(mentorId, menteeId, skillId)
                .orElse(null);
    }

    public Double getAverageForMentorAndSkill(Long mentorId, Long skillId) {
        List<MentorRating> ratings = mentorRatingRepository.findByMentorUserIdAndSkillSkillId(mentorId, skillId);
        return ratings.stream().mapToInt(MentorRating::getRating).average().orElse(0.0);
    }
}

