<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <HelloWorld msg="You did it!" />
  </n-config-provider>
</template>
