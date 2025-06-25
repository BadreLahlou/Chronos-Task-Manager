package com.badrelahlou.taskmanager.repository;

import com.badrelahlou.taskmanager.model.TaskAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskAttachmentRepository extends JpaRepository<TaskAttachment, Long> {
}