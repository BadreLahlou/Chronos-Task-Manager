package com.badrelahlou.taskmanager.model;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "tasks")
@Data 
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime startTime = LocalDateTime.now();

    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime endTime = LocalDateTime.now().plusHours(1);

    @Column
    private Long timeSpent;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;

    @ManyToOne
    @JoinColumn(name = "assigned_user_id")
    private User assignedUser;

    @ManyToMany
    @JoinTable(
        name = "task_dependencies",
        joinColumns = @JoinColumn(name = "task_id"),
        inverseJoinColumns = @JoinColumn(name = "dependency_id")
    )
    private List<Task> dependencies;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @Column
    private String createdBy; 

    @Column
    private String recurrenceRule; 

    @OneToMany(mappedBy = "parentTask", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> subtasks; 

    @ManyToMany
    @JoinTable(
        name = "task_resources",
        joinColumns = @JoinColumn(name = "task_id"),
        inverseJoinColumns = @JoinColumn(name = "resource_id")
    )
    private List<Resource> resources; 

    @ManyToOne
    @JoinColumn(name = "parent_task_id")
    private Task parentTask; 

    @Column
    private Boolean timerRunning = false;

    @Column
    private Long timerStart = null; // epoch millis

    @Column
    private Long timerAccumulated = 0L; // seconds

    public void calculateTimeSpent() {
        if (startTime != null && endTime != null) {
            Duration duration = Duration.between(startTime, endTime);
            this.timeSpent = duration.toMinutes();
        } else {
            this.timeSpent = 0L;
        }
    }

    // Lombok @Data should generate all getters/setters, but add explicit ones for compatibility
    public TaskStatus getStatus() { return this.status; }
    public void setStatus(TaskStatus status) { this.status = status; }
    public String getTitle() { return this.title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return this.description; }
    public void setDescription(String description) { this.description = description; }
    public User getAssignedUser() { return this.assignedUser; }
    public void setAssignedUser(User user) { this.assignedUser = user; }
    public List<Task> getDependencies() { return this.dependencies; }
    public void setDependencies(List<Task> dependencies) { this.dependencies = dependencies; }
    public List<Resource> getResources() { return this.resources; }
    public void setResources(List<Resource> resources) { this.resources = resources; }
    public String getRecurrenceRule() { return this.recurrenceRule; }
    public void setRecurrenceRule(String rule) { this.recurrenceRule = rule; }
    public List<Task> getSubtasks() { return this.subtasks; }
    public void setSubtasks(List<Task> subtasks) { this.subtasks = subtasks; }
    public LocalDateTime getStartTime() { return this.startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return this.endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public Priority getPriority() { return this.priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
    public Long getTimeSpent() { return this.timeSpent; }
    public void setTimeSpent(Long timeSpent) { this.timeSpent = timeSpent; }
    public Boolean getTimerRunning() { return timerRunning; }
    public void setTimerRunning(Boolean timerRunning) { this.timerRunning = timerRunning; }
    public Long getTimerStart() { return timerStart; }
    public void setTimerStart(Long timerStart) { this.timerStart = timerStart; }
    public Long getTimerAccumulated() { return timerAccumulated; }
    public void setTimerAccumulated(Long timerAccumulated) { this.timerAccumulated = timerAccumulated; }
}
