package com.task.taskservice.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.task.taskservice.entity.Status;
import com.task.taskservice.entity.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    Page<Task> findAllByStatus(Status status, Pageable pageable);

    Page<Task> findAllByTitleContainingIgnoreCase(String title, Pageable pageable);

    Page<Task> findAllByStatusAndTitleContainingIgnoreCase(Status status, String title, Pageable pageable);
}
