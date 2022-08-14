<script setup lang="ts">
import { useRoute } from 'vue-router'
import Fine from './fine.vue'
import Other from './other.vue'

const route = useRoute()
</script>
<template>
  <div class="detail-index">
    <template v-if="route.params.type === 1">
      <fine />
    </template>

    <template>
      其他
      <Other />
    </template>
    <template> 事前 </template>
  </div>
</template>
