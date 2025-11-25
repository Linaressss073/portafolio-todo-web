package com.task.taskservice.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.task.taskservice.dto.CreateTaskRequest;
import com.task.taskservice.dto.UpdateTaskRequest;
import com.task.taskservice.dto.TaskResponse;
import com.task.taskservice.entity.Status;
import com.task.taskservice.entity.Task;
import com.task.taskservice.repository.TaskRepository;

@SpringBootTest
@ActiveProfiles("test")
class TaskServiceTest {

    @Autowired
    private TaskService taskService;

    @Autowired
    private TaskRepository taskRepository;

    @BeforeEach
    void setup() {
        taskRepository.deleteAll();
    }

    @Test
    void create_shouldPersistTask() {
        CreateTaskRequest req = new CreateTaskRequest();
        req.setTitle("Nueva tarea");
        req.setDueDate(LocalDate.now().plusDays(1));

        TaskResponse resp = taskService.create(req);

        assertThat(resp.getId()).isNotNull();
        assertThat(resp.getTitle()).isEqualTo("Nueva tarea");
        assertThat(resp.getStatus()).isEqualTo(Status.OPEN);
        assertThat(taskRepository.count()).isEqualTo(1);
    }

    @Test
    void update_shouldModifyFields() {
        Task seed = new Task();
        seed.setTitle("Tarea");
        seed.setStatus(Status.OPEN);
        seed = taskRepository.save(seed);

        UpdateTaskRequest req = new UpdateTaskRequest();
        req.setTitle("Actualizada");
        req.setStatus(Status.DONE);
        req.setDueDate(LocalDate.now().plusDays(2));

        TaskResponse resp = taskService.update(seed.getId(), req);

        assertThat(resp.getTitle()).isEqualTo("Actualizada");
        assertThat(resp.getStatus()).isEqualTo(Status.DONE);
        assertThat(resp.getDueDate()).isEqualTo(req.getDueDate());
    }
}
