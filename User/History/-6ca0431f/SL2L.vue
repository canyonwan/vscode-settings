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
    router.push({ name: key })
  }

  const breadcrumbList = computed(() => {
    return generator(route.matched)
  })
</script>
<template>
  <!-- 面包屑 -->
  <n-breadcrumb class="text-xs">
    <template v-for="routeItem in breadcrumbList" :key="routeItem.name">
      <n-breadcrumb-item @click="dropdownSelect(routeItem.name)">
        {{ routeItem.meta.title }}
      </n-breadcrumb-item>
    </template>
  </n-breadcrumb>
</template>
