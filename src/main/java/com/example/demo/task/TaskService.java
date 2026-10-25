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
        return list(null, 0, null);
    }

    public List<Task> list(Boolean done, int offset, Integer limit) {
        if (offset < 0) {
            throw new IllegalArgumentException("offset must be at least 0");
        }
        if (limit != null && (limit < 1 || limit > 100)) {
            throw new IllegalArgumentException("limit must be between 1 and 100");
        }
        return tasks.values().stream()
                .filter(task -> done == null || task.done() == done)
                .sorted(Comparator.comparing(Task::id))
                .skip(offset)
                .limit(limit == null ? Long.MAX_VALUE : limit)
                .toList();
    }

    public Task get(Long id) {
        Task task = tasks.get(id);
        if (task == null) {
            throw new TaskNotFoundException(id);
        }
        return task;
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
