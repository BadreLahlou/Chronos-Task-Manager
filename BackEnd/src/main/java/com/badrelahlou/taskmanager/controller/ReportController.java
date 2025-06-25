package com.badrelahlou.taskmanager.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.badrelahlou.taskmanager.model.Task; 
import com.badrelahlou.taskmanager.model.TaskStatus;
import com.badrelahlou.taskmanager.service.TaskService;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    @Autowired
    private TaskService taskService;

    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_MANAGER')") 
    @GetMapping("/task-completion")
    public Map<String, Object> getTaskCompletionReport() {
        Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE); 
        List<Task> tasks = taskService.getAllTasks(pageable).getContent();
        long totalTasks = tasks.size();

       
        long completedTasks = tasks.stream().filter(t -> TaskStatus.DONE.equals(t.getStatus())).count();
        long inProgressTasks = tasks.stream().filter(t -> TaskStatus.IN_PROGRESS.equals(t.getStatus())).count();
        long todoTasks = tasks.stream().filter(t -> TaskStatus.TODO.equals(t.getStatus())).count();

        Map<String, Object> report = new HashMap<>();
        report.put("totalTasks", totalTasks);
        report.put("completedTasks", completedTasks);
        report.put("inProgressTasks", inProgressTasks);
        report.put("todoTasks", todoTasks);
        return report;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_MANAGER')") 
    @GetMapping("/user-activity")
    public Map<String, Object> getUserActivityReport(@RequestParam Long userId) {
        Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE);
        List<Task> tasks = taskService.getAllTasks(pageable).getContent();
        long total = tasks.stream().filter(t -> t.getAssignedUser() != null && t.getAssignedUser().getId().equals(userId)).count();
        long completed = tasks.stream().filter(t -> t.getAssignedUser() != null && t.getAssignedUser().getId().equals(userId) && TaskStatus.DONE.equals(t.getStatus())).count();
        long inProgress = tasks.stream().filter(t -> t.getAssignedUser() != null && t.getAssignedUser().getId().equals(userId) && TaskStatus.IN_PROGRESS.equals(t.getStatus())).count();
        long todo = tasks.stream().filter(t -> t.getAssignedUser() != null && t.getAssignedUser().getId().equals(userId) && TaskStatus.TODO.equals(t.getStatus())).count();
        Map<String, Object> report = new HashMap<>();
        report.put("totalTasks", total);
        report.put("completedTasks", completed);
        report.put("inProgressTasks", inProgress);
        report.put("todoTasks", todo);
        return report;
    }
}
