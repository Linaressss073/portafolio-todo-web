package com.task.taskservice.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.task.taskservice.entity.Status;

public class TaskResponse {

    private Long id;
    private String title;
    private Status status;
    private LocalDate dueDate;
    private LocalDateTime createdAt;

    public TaskResponse(Long id, String title, Status status, LocalDate dueDate, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.status = status;
        this.dueDate = dueDate;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public Status getStatus() {
        return status;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
