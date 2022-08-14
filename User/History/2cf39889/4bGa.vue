<template>
  <div data-test="todo" v-for="item in todos" :key="item.id">
    {{ item.text }}
  </div>
</template>

<script>
  export default {
    name: 'TodoApp',

    data() {
      return {
        todos: [
          {
            id: 1,
            text: 'Learn Vue.js 3',
            completed: false
          }
        ]
      }
    }
  }
</script>
