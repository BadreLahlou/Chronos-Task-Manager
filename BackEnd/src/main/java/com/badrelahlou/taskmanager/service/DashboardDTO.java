package com.badrelahlou.taskmanager.service;

import lombok.Data;

@Data
public class DashboardDTO {
    private long todoCount;
    private long inProgressCount;
    private long doneCount;
    private long totalTasks;

    public DashboardDTO(long todoCount, long inProgressCount, long doneCount, long totalTasks) {
        this.todoCount = todoCount;
        this.inProgressCount = inProgressCount;
        this.doneCount = doneCount;
        this.totalTasks = totalTasks;
    }
}