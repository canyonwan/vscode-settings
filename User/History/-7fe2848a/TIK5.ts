import { mount } from "@vue/test-utils";
import { test, expect } from "vitest";

import TodoApp from "@/components/Todo.vue";

test("renders a todo", async () => {
  const wrapper = mount(TodoApp);

  const todo = wrapper.get('[data-test="todo"]');

  expect(todo.text()).toBe("Learn Vue.js 3");
});
