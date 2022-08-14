<script lang="ts">
import { ref, defineComponent, PropType, watch } from 'vue'
import type { IAction } from '../after/options'

export default defineComponent({
  components: {},
  name: 'Actions',
  props: {
    data: {
      type: Array as PropType<IAction[]>,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const currentAction = ref()

    function onSwitch(item: IAction) {
      currentAction.value = item.value
    }

    watch(
      () => props.data,
      () => {
        currentAction.value = props.data[0].value
      },
      { immediate: true }
    )

    return {
      currentAction,
      onSwitch
    }
  }
})
</script>
<template>
  <div class="actions">
    <div v-for="(item, index) in data" :key="item.value" @click="onSwitch(item)" :class="['action', { isSelected: currentAction === item.value }]">
      <div class="icon-item">
        <img :src="item.icon" alt="" width="40" />
        <div>{{ item.text }}</div>
      </div>
      <div class="line" v-if="index !== data.length - 1"></div>
    </div>
  </div>
</template>

<style scoped lang="less">
.actions {
  width: 100%;
  border-radius: 4px;
  background-color: white;
  display: flex;
  flex: 1;
  justify-content: space-between;
  border: 1px solid #dfdede;
  .action {
    cursor: pointer;
    padding: 18px 0;
    align-items: center;
    display: flex;
    flex: 1;
    &.isSelected {
      background-color: #edf5ff;
      transition: 200ms ease-in;
    }
    .icon-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .line {
      width: 0px;
      height: 58px;
      border: 1px solid #dfdede;
    }
  }
}
</style>
