package com.badrelahlou.taskmanager.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.badrelahlou.taskmanager.dto.TaskResponse;
import com.badrelahlou.taskmanager.model.Resource; 
import com.badrelahlou.taskmanager.model.Task;
import com.badrelahlou.taskmanager.model.TaskStatus;
import com.badrelahlou.taskmanager.model.User;
import com.badrelahlou.taskmanager.repository.ResourceRepository;
import com.badrelahlou.taskmanager.repository.TaskRepository;
import com.badrelahlou.taskmanager.repository.UserRepository;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ResourceRepository resourceRepository; 

    public Task createTask(Task task, List<Long> dependencyIds) {
        if (dependencyIds != null && !dependencyIds.isEmpty()) {
            List<Task> dependencies = taskRepository.findAllById(dependencyIds);
            task.setDependencies(dependencies);
        }
        task.setStatus(TaskStatus.TODO);
        return taskRepository.save(task);
    }

    public Task startTimer(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
        if (task.getStartTime() != null) {
            throw new RuntimeException("Timer is already running for task id: " + taskId);
        }
        task.setStartTime(LocalDateTime.now());
        task.setStatus(TaskStatus.IN_PROGRESS);
        return taskRepository.save(task);
    }

    public Task stopTimer(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
        if (task.getStartTime() == null) {
            throw new RuntimeException("Timer has not been started for task id: " + taskId);
        }
        if (task.getEndTime() != null) {
            throw new RuntimeException("Timer is already stopped for task id: " + taskId);
        }
        task.setEndTime(LocalDateTime.now());
        task.calculateTimeSpent();
        task.setStatus(TaskStatus.DONE);

        
        taskRepository.findAll().stream()
        .filter(t -> t.getDependencies().contains(task) && t.getStatus() != TaskStatus.DONE)
                .forEach(t -> notificationService.createNotification(t.getAssignedUser(),
                        "Dependency '" + task.getTitle() + "' completed for task '" + t.getTitle() + "'"));

        return taskRepository.save(task);
    }

    public Page<Task> getAllTasks(Pageable pageable) {
        return taskRepository.findAll(pageable);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }

    public Task updateTask(Long id, Task updatedTask) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setPriority(updatedTask.getPriority());
        task.setStatus(updatedTask.getStatus());
        task.setSubtasks(updatedTask.getSubtasks());
        task.setRecurrenceRule(updatedTask.getRecurrenceRule());
        task.setResources(updatedTask.getResources());
    
      
        if (!task.getStatus().equals(updatedTask.getStatus())) {
            notificationService.createNotification(task.getAssignedUser(), 
                "Your task '" + task.getTitle() + "' status changed to " + updatedTask.getStatus());
        }
    
        return taskRepository.save(task);
    }
    

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        taskRepository.delete(task);
    }

    public Task assignTaskToUser(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        task.setAssignedUser(user);
        task = taskRepository.save(task);
        notificationService.createNotification(user, "Task '" + task.getTitle() + "' has been assigned to you.");
        return task;
    }

    public Task assignResources(Long taskId, List<Long> resourceIds) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
        List<Resource> resources = resourceRepository.findAllById(resourceIds);
        task.setResources(resources);
        return taskRepository.save(task);
    }

    public TaskResponse toTaskResponse(Task task) {
        TaskResponse dto = new TaskResponse();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus() != null ? task.getStatus().name() : null);
        dto.setPriority(task.getPriority() != null ? task.getPriority().name() : null);
        dto.setStartTime(task.getStartTime());
        dto.setEndTime(task.getEndTime());
        dto.setTimeSpent(task.getTimeSpent());
        dto.setAssignedUserId(task.getAssignedUser() != null ? task.getAssignedUser().getId() : null);
        dto.setDependencyIds(task.getDependencies() != null ?
            task.getDependencies().stream().map(Task::getId).collect(Collectors.toList()) : new ArrayList<>());
        return dto;
    }

    public List<Task> filterTasks(String status, String priority, String startDate, String endDate) {
        List<Task> all = taskRepository.findAll();
        return all.stream().filter(task -> {
            boolean match = true;
            if (status != null && !status.isEmpty()) {
                match &= task.getStatus() != null && task.getStatus().name().equalsIgnoreCase(status);
            }
            if (priority != null && !priority.isEmpty()) {
                match &= task.getPriority() != null && task.getPriority().name().equalsIgnoreCase(priority);
            }
            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            if (startDate != null && !startDate.isEmpty()) {
                LocalDate start = LocalDate.parse(startDate, fmt);
                match &= task.getStartTime() != null && !task.getStartTime().toLocalDate().isBefore(start);
            }
            if (endDate != null && !endDate.isEmpty()) {
                LocalDate end = LocalDate.parse(endDate, fmt);
                match &= task.getEndTime() != null && !task.getEndTime().toLocalDate().isAfter(end);
            }
            return match;
        }).collect(Collectors.toList());
    }

    public List<Task> getTasksForCalendar(String month, String year) {
        int m = Integer.parseInt(month);
        int y = Integer.parseInt(year);
        return taskRepository.findAll().stream()
            .filter(task -> task.getStartTime() != null &&
                task.getStartTime().getMonthValue() == m &&
                task.getStartTime().getYear() == y)
            .collect(Collectors.toList());
    }

    public Long getUserTimeSummary(Long userId) {
        return taskRepository.findAll().stream()
            .filter(task -> task.getAssignedUser() != null && userId.equals(task.getAssignedUser().getId()))
            .mapToLong(task -> task.getTimeSpent() != null ? task.getTimeSpent() : 0L)
            .sum();
    }

    public Long getTaskTimeSummary(Long taskId) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        return task.getTimeSpent() != null ? task.getTimeSpent() : 0L;
    }

    public List<String> getTaskComments(Long taskId) {
        // TODO: Replace with real TaskComment entity/DTO
        return new java.util.ArrayList<>();
    }

    public void addTaskComment(Long taskId, String comment) {
        // TODO: Replace with real TaskComment entity/DTO and persistence
    }

    public List<String> getTaskAttachments(Long taskId) {
        // TODO: Replace with real TaskAttachment entity/DTO
        return new java.util.ArrayList<>();
    }

    public void addTaskAttachment(Long taskId, String fileUrl) {
        // TODO: Replace with real TaskAttachment entity/DTO and persistence
    }

    // --- TIMER LOGIC FOR ROBUST PERSISTENCE ---
    public Task startTaskTimer(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
        if (Boolean.TRUE.equals(task.getTimerRunning())) {
            throw new RuntimeException("Timer is already running for task id: " + taskId);
        }
        task.setTimerRunning(true);
        task.setTimerStart(System.currentTimeMillis());
        // Do not reset timerAccumulated, so timer can be resumed
        return taskRepository.save(task);
    }

    public Task pauseTaskTimer(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
        if (!Boolean.TRUE.equals(task.getTimerRunning())) {
            throw new RuntimeException("Timer is not running for task id: " + taskId);
        }
        Long now = System.currentTimeMillis();
        Long start = task.getTimerStart() != null ? task.getTimerStart() : now;
        Long elapsed = (now - start) / 1000; // seconds
        task.setTimerAccumulated(task.getTimerAccumulated() + elapsed);
        task.setTimerRunning(false);
        task.setTimerStart(null);
        return taskRepository.save(task);
    }

    public Task updateTaskTimer(Long taskId, Boolean timerRunning, Long timerStart, Long timerAccumulated) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
        task.setTimerRunning(timerRunning);
        task.setTimerStart(timerStart);
        task.setTimerAccumulated(timerAccumulated);
        return taskRepository.save(task);
    }
}
