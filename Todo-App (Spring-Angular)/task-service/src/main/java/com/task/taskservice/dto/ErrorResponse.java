package com.task.taskservice.dto;

import java.time.OffsetDateTime;
import java.util.List;

public class ErrorResponse {

    private final OffsetDateTime timestamp = OffsetDateTime.now();
    private final String path;
    private final String code;
    private final String message;
    private final List<String> details;

    public ErrorResponse(String path, String code, String message, List<String> details) {
        this.path = path;
        this.code = code;
        this.message = message;
        this.details = details;
    }

    public OffsetDateTime getTimestamp() {
        return timestamp;
    }

    public String getPath() {
        return path;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public List<String> getDetails() {
        return details;
    }
}
