package com.task.taskservice.dto;

import java.time.LocalDate;

import com.task.taskservice.entity.Status;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Size;

public class UpdateTaskRequest {

    @Size(min = 1, max = 120)
    private String title;

    private Status status;

    @FutureOrPresent(message = "dueDate must be today or in the future")
    private LocalDate dueDate;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
}
