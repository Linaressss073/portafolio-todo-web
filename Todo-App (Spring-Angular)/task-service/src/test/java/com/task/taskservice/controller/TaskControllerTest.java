package com.task.taskservice.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.task.taskservice.entity.Status;
import com.task.taskservice.entity.Task;
import com.task.taskservice.repository.TaskRepository;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TaskRepository taskRepository;

    @BeforeEach
    void setup() {
        taskRepository.deleteAll();
    }

    @Test
    void shouldCreateTask() throws Exception {
        var payload = new CreatePayload("Demo task", LocalDate.now().plusDays(1));

        mockMvc.perform(post("/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("Demo task")))
                .andExpect(jsonPath("$.status", is("OPEN")));
    }

    @Test
    void shouldReturnBadRequestOnInvalidTitle() throws Exception {
        var payload = new CreatePayload("", LocalDate.now().plusDays(1));

        mockMvc.perform(post("/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldListWithStatusFilter() throws Exception {
        Task a = new Task();
        a.setTitle("A");
        a.setStatus(Status.OPEN);

        Task b = new Task();
        b.setTitle("B");
        b.setStatus(Status.DONE);

        taskRepository.save(a);
        taskRepository.save(b);

        mockMvc.perform(get("/tasks")
                        .param("status", "DONE")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].title", is("B")));
    }

    @Test
    void shouldReturnNotFoundOnPatchMissingTask() throws Exception {
        mockMvc.perform(patch("/tasks/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"X\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldDeleteTask() throws Exception {
        Task task = new Task();
        task.setTitle("Delete me");
        task.setStatus(Status.OPEN);
        task = taskRepository.save(task);

        mockMvc.perform(delete("/tasks/{id}", task.getId()))
                .andExpect(status().isNoContent());
    }

    private record CreatePayload(String title, LocalDate dueDate) { }
}
