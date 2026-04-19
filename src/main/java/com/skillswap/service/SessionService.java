package com.skillswap.service;

import com.skillswap.entity.Session;
import com.skillswap.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SessionService {
    @Autowired
    private SessionRepository sessionRepository;

    public Session createSession(Session session) {
        session.setStatus(Session.SessionStatus.SCHEDULED);
        return sessionRepository.save(session);
    }

    public Optional<Session> findById(Long sessionId) {
        return sessionRepository.findById(sessionId);
    }

    public List<Session> findByMenteeId(Long menteeId) {
        return sessionRepository.findByMenteeUserId(menteeId);
    }

    public List<Session> findByMentorId(Long mentorId) {
        return sessionRepository.findByMentorUserId(mentorId);
    }

    public List<Session> findByStatus(Session.SessionStatus status) {
        return sessionRepository.findByStatus(status);
    }

    public List<Session> findUpcomingSessions(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        List<Session> mentorSessions = sessionRepository.findByMentorUserIdAndStatus(
            userId, Session.SessionStatus.SCHEDULED);
        mentorSessions.addAll(sessionRepository.findByMenteeUserIdAndStatus(
            userId, Session.SessionStatus.SCHEDULED));
        return mentorSessions;
    }

    public Session completeSession(Long sessionId) {
        Optional<Session> session = sessionRepository.findById(sessionId);
        if (session.isPresent()) {
            session.get().setStatus(Session.SessionStatus.COMPLETED);
            session.get().setActualEnd(LocalDateTime.now());
            return sessionRepository.save(session.get());
        }
        throw new RuntimeException("Session not found");
    }

    public Session rescheduleSession(Long sessionId, LocalDateTime newStart, LocalDateTime newEnd) {
        Optional<Session> session = sessionRepository.findById(sessionId);
        if (session.isPresent()) {
            session.get().setScheduledStart(newStart);
            session.get().setScheduledEnd(newEnd);
            session.get().setStatus(Session.SessionStatus.RESCHEDULED);
            return sessionRepository.save(session.get());
        }
        throw new RuntimeException("Session not found");
    }

    public Session cancelSession(Long sessionId) {
        Optional<Session> session = sessionRepository.findById(sessionId);
        if (session.isPresent()) {
            session.get().setStatus(Session.SessionStatus.CANCELLED);
            return sessionRepository.save(session.get());
        }
        throw new RuntimeException("Session not found");
    }

    public List<Session> findAllSessions() {
        return sessionRepository.findAll();
    }
}
