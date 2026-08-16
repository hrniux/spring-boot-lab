package com.example.demo.task;

public record Task(Long id, String title, boolean done) {

    public Task markDone() {
        return new Task(id, title, true);
    }
}
