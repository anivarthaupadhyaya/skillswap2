package com.skillswap.repository;

import com.skillswap.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByMenteeUserId(Long menteeId);
    List<Request> findByMentorUserId(Long mentorId);
    List<Request> findByStatus(Request.RequestStatus status);
    List<Request> findByMenteeUserIdAndStatus(Long menteeId, Request.RequestStatus status);
    List<Request> findByMentorUserIdAndStatus(Long mentorId, Request.RequestStatus status);
}
