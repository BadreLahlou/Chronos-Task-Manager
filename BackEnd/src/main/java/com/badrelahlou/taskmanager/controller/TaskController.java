package com.badrelahlou.taskmanager.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.badrelahlou.taskmanager.dto.TaskRequest;
import com.badrelahlou.taskmanager.dto.TaskResponse;
import com.badrelahlou.taskmanager.model.Task;
import com.badrelahlou.taskmanager.service.TaskService;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody TaskRequest taskRequest) {
        try {
            Task task = taskService.createTask(taskRequest.getTask(), taskRequest.getDependencyIds());
            return ResponseEntity.status(HttpStatus.CREATED).body(taskService.toTaskResponse(task));
        } catch (RuntimeException e) {
            // Return error message for debugging
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            List<TaskResponse> tasks = taskService.getAllTasks(PageRequest.of(page, size))
                .stream().map(taskService::toTaskResponse).toList();
            return ResponseEntity.ok(tasks);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id) {
        try {
            Task task = taskService.getTaskById(id);
            return ResponseEntity.ok(taskService.toTaskResponse(task));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable Long id, @RequestBody Task task) {
        try {
            Task updatedTask = taskService.updateTask(id, task);
            return ResponseEntity.ok(taskService.toTaskResponse(updatedTask));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        try {
            taskService.deleteTask(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<TaskResponse> assignTaskToUser(@PathVariable Long id, @RequestBody Long userId) {
        try {
            Task task = taskService.assignTaskToUser(id, userId);
            return ResponseEntity.ok(taskService.toTaskResponse(task));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<List<TaskResponse>> filterTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            List<TaskResponse> tasks = taskService.filterTasks(status, priority, startDate, endDate)
                .stream().map(taskService::toTaskResponse).toList();
            return ResponseEntity.ok(tasks);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping("/calendar")
    public ResponseEntity<List<TaskResponse>> getTasksForCalendar(
            @RequestParam String month,
            @RequestParam String year) {
        try {
            List<TaskResponse> tasks = taskService.getTasksForCalendar(month, year)
                .stream().map(taskService::toTaskResponse).toList();
            return ResponseEntity.ok(tasks);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping("/user/{userId}/time-summary")
    public ResponseEntity<Long> getUserTimeSummary(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(taskService.getUserTimeSummary(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping("/{taskId}/time-summary")
    public ResponseEntity<Long> getTaskTimeSummary(@PathVariable Long taskId) {
        try {
            return ResponseEntity.ok(taskService.getTaskTimeSummary(taskId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping("/{taskId}/comments")
    public ResponseEntity<List<String>> getTaskComments(@PathVariable Long taskId) {
        try {
            return ResponseEntity.ok(taskService.getTaskComments(taskId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/{taskId}/comments")
    public ResponseEntity<?> addTaskComment(@PathVariable Long taskId, @RequestBody String comment) {
        try {
            taskService.addTaskComment(taskId, comment);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{taskId}/attachments")
    public ResponseEntity<List<String>> getTaskAttachments(@PathVariable Long taskId) {
        try {
            return ResponseEntity.ok(taskService.getTaskAttachments(taskId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/{taskId}/attachments")
    public ResponseEntity<?> addTaskAttachment(@PathVariable Long taskId, @RequestBody String fileUrl) {
        try {
            taskService.addTaskAttachment(taskId, fileUrl);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}/timer/start")
    public ResponseEntity<TaskResponse> startTaskTimer(@PathVariable Long id) {
        try {
            Task task = taskService.startTaskTimer(id);
            return ResponseEntity.ok(taskService.toTaskResponse(task));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PutMapping("/{id}/timer/pause")
    public ResponseEntity<TaskResponse> pauseTaskTimer(@PathVariable Long id) {
        try {
            Task task = taskService.pauseTaskTimer(id);
            return ResponseEntity.ok(taskService.toTaskResponse(task));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PutMapping("/{id}/timer/update")
    public ResponseEntity<TaskResponse> updateTaskTimer(@PathVariable Long id, @RequestBody TimerUpdateRequest req) {
        try {
            Task task = taskService.updateTaskTimer(id, req.getTimerRunning(), req.getTimerStart(), req.getTimerAccumulated());
            return ResponseEntity.ok(taskService.toTaskResponse(task));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

}

class TimerUpdateRequest {
    private Boolean timerRunning;
    private Long timerStart;
    private Long timerAccumulated;
    public Boolean getTimerRunning() { return timerRunning; }
    public void setTimerRunning(Boolean timerRunning) { this.timerRunning = timerRunning; }
    public Long getTimerStart() { return timerStart; }
    public void setTimerStart(Long timerStart) { this.timerStart = timerStart; }
    public Long getTimerAccumulated() { return timerAccumulated; }
    public void setTimerAccumulated(Long timerAccumulated) { this.timerAccumulated = timerAccumulated; }
}