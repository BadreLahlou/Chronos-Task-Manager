package com.badrelahlou.taskmanager.repository;

import com.badrelahlou.taskmanager.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
}