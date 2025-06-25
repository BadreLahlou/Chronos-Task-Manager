package com.badrelahlou.taskmanager.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.badrelahlou.taskmanager.model.Task;
import com.badrelahlou.taskmanager.model.TaskStatus;
import com.badrelahlou.taskmanager.repository.TaskRepository;


@Service
public class TaskScheduler {
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private NotificationService notificationService;

    @Scheduled(fixedRate = 86400000) 
    public void createRecurringTasks() {
        taskRepository.findAll().stream()
                .filter(task -> task.getRecurrenceRule() != null && !task.getRecurrenceRule().isEmpty())
                .forEach(task -> {
                    
                    Task newTask = new Task();
                    newTask.setTitle(task.getTitle());
                    newTask.setDescription(task.getDescription());
                    newTask.setPriority(task.getPriority());
                    task.setStatus(TaskStatus.TODO);
                    taskRepository.save(newTask);
                });
    }

    @Scheduled(fixedRate = 3600000) 
    public void sendReminders() {
        taskRepository.findAll().stream()
        .filter(task -> task.getStatus() == TaskStatus.TODO && task.getAssignedUser() != null)
                .forEach(task -> notificationService.createNotification(task.getAssignedUser(),
                        "Reminder: Task '" + task.getTitle() + "' is pending."));
    }
}
