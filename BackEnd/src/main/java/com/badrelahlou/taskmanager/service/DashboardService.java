package com.badrelahlou.taskmanager.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired; 
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.badrelahlou.taskmanager.model.Task;
import com.badrelahlou.taskmanager.model.TaskStatus;
import com.badrelahlou.taskmanager.repository.TaskRepository;

@Service
public class DashboardService {
    @Autowired
    private TaskRepository taskRepository;

    @Cacheable("userDashboard")
    public DashboardDTO getUserDashboard(Long userId) {
        List<Task> tasks = taskRepository.findByAssignedUserId(userId);
        
        long todoCount = tasks.stream().filter(t -> t.getStatus() == TaskStatus.TODO).count();
        long inProgressCount = tasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();
        long doneCount = tasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count();

        return new DashboardDTO(todoCount, inProgressCount, doneCount, tasks.size());
    }
}
