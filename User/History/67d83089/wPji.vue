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
</script>
<template>
  <!-- 面包屑 -->
  <n-breadcrumb class="text-xs">
    <template v-for="routeItem in breadcrumbList" :key="routeItem.name">
      <!-- {{ routeItem.children }} -->
      <n-breadcrumb-item v-for="item in routeItem.children" :key="item.name">
        {{ item.meta.title }}
        <!-- <n-dropdown v-if="routeItem.children.length" :options="routeItem.children" @select="dropdownSelect">
          <span class="link-text">
            <component :is="routeItem.meta.icon" />
            {{ routeItem.meta.title }}
          </span>
        </n-dropdown>
        <span class="link-text" v-else>
          <component :is="routeItem.meta.icon" />
          {{ routeItem.meta.title }}
        </span> -->
      </n-breadcrumb-item>
    </template>
  </n-breadcrumb>
</template>
