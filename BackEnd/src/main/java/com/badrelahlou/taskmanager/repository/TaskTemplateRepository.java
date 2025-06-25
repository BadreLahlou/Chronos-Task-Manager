package com.badrelahlou.taskmanager.repository;

import com.badrelahlou.taskmanager.model.TaskTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskTemplateRepository extends JpaRepository<TaskTemplate, Long> {
}