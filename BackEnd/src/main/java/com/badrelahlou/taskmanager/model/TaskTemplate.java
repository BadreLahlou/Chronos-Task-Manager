package com.badrelahlou.taskmanager.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "task_templates")
@Data
public class TaskTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column
    private String description;

    @Enumerated(EnumType.STRING)
    private Priority priority;
}