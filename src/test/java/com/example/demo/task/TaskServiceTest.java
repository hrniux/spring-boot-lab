package com.example.demo.task;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class TaskServiceTest {

    private final TaskService taskService = new TaskService();

    @Test
    void createThenList() {
        Task created = taskService.create("write tests");

        assertThat(created.id()).isEqualTo(1L);
        assertThat(created.title()).isEqualTo("write tests");
        assertThat(created.done()).isFalse();
        assertThat(taskService.list()).containsExactly(created);
    }

    @Test
    void completeMarksDone() {
        Task created = taskService.create("ship it");

        Task done = taskService.complete(created.id());

        assertThat(done.done()).isTrue();
        assertThat(taskService.list().get(0).done()).isTrue();
    }

    @Test
    void completeUnknownTaskThrows() {
        assertThatThrownBy(() -> taskService.complete(999L))
                .isInstanceOf(TaskNotFoundException.class)
                .hasMessageContaining("999");
    }
}
