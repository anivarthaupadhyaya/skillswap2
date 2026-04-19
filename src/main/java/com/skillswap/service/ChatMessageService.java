package com.skillswap.service;

import com.skillswap.entity.ChatMessage;
import com.skillswap.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatMessageService {
    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public ChatMessage save(ChatMessage chatMessage) {
        return chatMessageRepository.save(chatMessage);
    }

    public List<ChatMessage> findByRequest(Long requestId) {
        return chatMessageRepository.findByRequestRequestIdOrderBySentAtAsc(requestId);
    }
}

