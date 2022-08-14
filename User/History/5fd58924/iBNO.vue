<template>
  <div class="tree-select">
    <n-tree-select filterable :options="options" default-value="Drive My Car" clearable />
  </div>
</template>

<script setup lang="ts">
  function getGoodsCateTree(params: type) {
    queryGoodsCateTree()
  }
</script>

<style scoped></style>
