<script setup lang="ts">
  const props = defineProps({
    isDocMake: {
      type: Boolean,
      default: false
    }
  })
  const router = useRouter()
  const route = useRoute()
</script>
<template>
  <!-- 面包屑 -->
  <n-breadcrumb class="text-xs">
    <n-breadcrumb-item @click="router.push({ name: 'ProgramHome' })"> 执法台帐 </n-breadcrumb-item>
    <template v-if="!props.isDocMake">
      <n-breadcrumb-item>
        {{ route.meta.title }}
      </n-breadcrumb-item>
    </template>
    <template v-else>
      <n-breadcrumb-item @click="router.go(-1)"> 记录轴详情 </n-breadcrumb-item>
      <n-breadcrumb-item>
        {{ route.meta.title }}
      </n-breadcrumb-item>
    </template>
  </n-breadcrumb>
</template>
