package com.task.taskservice.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.task.taskservice.dto.CreateTaskRequest;
import com.task.taskservice.dto.TaskResponse;
import com.task.taskservice.dto.UpdateTaskRequest;
import com.task.taskservice.entity.Status;
import com.task.taskservice.entity.Task;
import com.task.taskservice.repository.TaskRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public TaskResponse create(CreateTaskRequest request) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setStatus(Status.OPEN);
        task.setDueDate(request.getDueDate());
        return toResponse(taskRepository.save(task));
    }

    public Page<TaskResponse> list(Status status, Pageable pageable) {
        if (status != null) {
            return taskRepository.findAllByStatus(status, pageable).map(this::toResponse);
        }
        return taskRepository.findAll(pageable).map(this::toResponse);
    }

    public TaskResponse get(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));
        return toResponse(task);
    }

    public TaskResponse update(Long id, UpdateTaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }

        return toResponse(taskRepository.save(task));
    }

    public void delete(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found");
        }
        taskRepository.deleteById(id);
    }

    private TaskResponse toResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getStatus(),
                task.getDueDate(),
                task.getCreatedAt());
    }
}
