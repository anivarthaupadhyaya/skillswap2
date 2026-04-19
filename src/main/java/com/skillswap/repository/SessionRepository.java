package com.skillswap.repository;

import com.skillswap.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByMenteeUserId(Long menteeId);
    List<Session> findByMentorUserId(Long mentorId);
    List<Session> findByStatus(Session.SessionStatus status);
    List<Session> findByMenteeUserIdAndStatus(Long menteeId, Session.SessionStatus status);
    List<Session> findByMentorUserIdAndStatus(Long mentorId, Session.SessionStatus status);
    List<Session> findByScheduledStartBetween(LocalDateTime start, LocalDateTime end);
}
