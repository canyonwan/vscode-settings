<script setup lang="ts">
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
    <n-breadcrumb-item>
      {{ route.params }}
    </n-breadcrumb-item>
    <n-breadcrumb-item>
      {{ route.meta.title }}
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>
