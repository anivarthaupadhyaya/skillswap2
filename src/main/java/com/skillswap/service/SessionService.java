package com.skillswap.service;

import com.skillswap.entity.Session;
import com.skillswap.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.Duration;
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

    public Session createOrUpdateSlotForRequest(
            Session existingSession,
            LocalDateTime start,
            Duration duration) {
        Session session = existingSession != null ? existingSession : new Session();
        session.setScheduledStart(start);
        session.setScheduledEnd(start.plus(duration));
        session.setStatus(Session.SessionStatus.PENDING_MENTEE_CONFIRMATION);
        return sessionRepository.save(session);
    }

    public Optional<Session> findById(Long sessionId) {
        return sessionRepository.findById(sessionId);
    }

    public Optional<Session> findByRequestId(Long requestId) {
        return sessionRepository.findByRequestRequestId(requestId);
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
        List<Session> mentorSessions = sessionRepository.findByMentorUserIdAndStatus(
            userId, Session.SessionStatus.SCHEDULED);
        mentorSessions.addAll(sessionRepository.findByMenteeUserIdAndStatus(
            userId, Session.SessionStatus.SCHEDULED));
        return mentorSessions;
    }

    public Session acceptByMentee(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        session.setStatus(Session.SessionStatus.SCHEDULED);
        return sessionRepository.save(session);
    }

    public Session rejectByMentee(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        session.setStatus(Session.SessionStatus.REJECTED_BY_MENTEE);
        return sessionRepository.save(session);
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
