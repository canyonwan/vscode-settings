<template>
  <!-- 面包屑 -->
  <n-breadcrumb v-if="crumbsSetting.show">
    <template v-for="routeItem in breadcrumbList" :key="routeItem.name">
      <n-breadcrumb-item>
        <n-dropdown v-if="routeItem.children.length" :options="routeItem.children" @select="dropdownSelect">
          <span class="link-text">
            <component v-if="crumbsSetting.showIcon && routeItem.meta.icon" :is="routeItem.meta.icon" />
            {{ routeItem.meta.title }}
          </span>
        </n-dropdown>
        <span class="link-text" v-else>
          <component v-if="crumbsSetting.showIcon && routeItem.meta.icon" :is="routeItem.meta.icon" />
          {{ routeItem.meta.title }}
        </span>
      </n-breadcrumb-item>
    </template>
  </n-breadcrumb>
</template>

<script setup lang="ts"></script>

<style scoped></style>
