<script setup lang="ts">
  const props = defineProps({
    routeType: {
      type: Number,
      default: 1
    }
  })
  const router = useRouter()
  const route = useRoute()
  const generator: any = (routerMap) => {
    return routerMap.map((item) => {
      const currentMenu = {
        ...item,
        label: item.meta.title,
        key: item.name,
        disabled: item.path === '/'
      }
      // 是否有子菜单，并递归处理
      if (item.children && item.children.length > 0) {
        // Recursion
        currentMenu.children = generator(item.children, currentMenu)
      }
      return currentMenu
    })
  }

  const dropdownSelect = (key) => {
    console.log('%c [ key ]-22', 'font-size:13px; background:#0095FF; color:white;', key)
    // router.push({ name: key })
    router.replace({ name: key })
  }

  const breadcrumbList = computed(() => {
    return generator(route.matched)
  })
  onMounted(() => {
    console.log('%c [  ]-32', 'font-size:13px; background:#0095FF; color:white;', route.meta.title)
  })
</script>
<template>
  <!-- 面包屑 -->
  <n-breadcrumb class="text-xs">
    <n-breadcrumb-item @click="router.push({ name: 'ProgramHome' })"> 执法台帐 </n-breadcrumb-item>
    <template v-if="props.routeType === 1">
      <n-breadcrumb-item v-if="props.routeType === 1">
        {{ route.meta.title }}
      </n-breadcrumb-item>
    </template>
  </n-breadcrumb>
</template>
