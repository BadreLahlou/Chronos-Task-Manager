package com.badrelahlou.taskmanager.dto;
import java.util.List;

import com.badrelahlou.taskmanager.model.Task;
public class TaskRequest {
    private Task task;
    private List<Long> dependencyIds;
    public Task getTask() { return task; }
    public void setTask(Task task) { this.task = task; }
    public List<Long> getDependencyIds() { return dependencyIds; }
    public void setDependencyIds(List<Long> dependencyIds) { this.dependencyIds = dependencyIds; }
}