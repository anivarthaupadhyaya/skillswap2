package com.skillswap.service;

import com.skillswap.entity.Request;
import com.skillswap.repository.RequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RequestService {
    @Autowired
    private RequestRepository requestRepository;

    public Request createRequest(Request request) {
        request.setStatus(Request.RequestStatus.PROPOSED);
        request.setRequestedAt(LocalDateTime.now());
        return requestRepository.save(request);
    }

    public Optional<Request> findById(Long requestId) {
        return requestRepository.findById(requestId);
    }

    public List<Request> findByMenteeId(Long menteeId) {
        return requestRepository.findByMenteeUserId(menteeId);
    }

    public List<Request> findByMentorId(Long mentorId) {
        return requestRepository.findByMentorUserId(mentorId);
    }

    public List<Request> findByStatus(Request.RequestStatus status) {
        return requestRepository.findByStatus(status);
    }

    public List<Request> findPendingRequestsForMentor(Long mentorId) {
        return requestRepository.findByMentorUserIdAndStatus(
            mentorId, Request.RequestStatus.PROPOSED);
    }

    public Request acceptRequest(Long requestId) {
        Optional<Request> request = requestRepository.findById(requestId);
        if (request.isPresent()) {
            request.get().setStatus(Request.RequestStatus.ACCEPTED);
            request.get().setRespondedAt(LocalDateTime.now());
            return requestRepository.save(request.get());
        }
        throw new RuntimeException("Request not found");
    }

    public Request declineRequest(Long requestId, String reason) {
        Optional<Request> request = requestRepository.findById(requestId);
        if (request.isPresent()) {
            request.get().setStatus(Request.RequestStatus.DECLINED);
            request.get().setDeclineReason(reason);
            request.get().setRespondedAt(LocalDateTime.now());
            return requestRepository.save(request.get());
        }
        throw new RuntimeException("Request not found");
    }

    public Request updateRequest(Request request) {
        request.setUpdatedAt(LocalDateTime.now());
        return requestRepository.save(request);
    }

    public List<Request> findAllRequests() {
        return requestRepository.findAll();
    }
}
