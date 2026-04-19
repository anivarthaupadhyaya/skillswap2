package com.skillswap.repository;

import com.skillswap.entity.MentorRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MentorRatingRepository extends JpaRepository<MentorRating, Long> {
    List<MentorRating> findByMentorUserId(Long mentorId);
    List<MentorRating> findByMentorUserIdAndSkillSkillId(Long mentorId, Long skillId);
    Optional<MentorRating> findByMentorUserIdAndMenteeUserIdAndSkillSkillId(Long mentorId, Long menteeId, Long skillId);
}

