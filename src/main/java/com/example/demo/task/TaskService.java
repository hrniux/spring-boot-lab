package com.example.demo.task;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

@Service
public class TaskService {

    private final Map<Long, Task> tasks = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(0);

    public List<Task> list() {
        return tasks.values().stream()
                .sorted(Comparator.comparing(Task::id))
                .toList();
    }

    public Task create(String title) {
        long id = idGenerator.incrementAndGet();
        Task task = new Task(id, title, false);
        tasks.put(id, task);
        return task;
    }

    public Task complete(Long id) {
        Task task = tasks.get(id);
        if (task == null) {
            throw new TaskNotFoundException(id);
        }
        Task done = task.markDone();
        tasks.put(id, done);
        return done;
    }
}
