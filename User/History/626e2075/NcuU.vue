<script lang="ts">
import type { IListDataForType } from '@/api/publicity-platform/types'
import { ref, defineComponent, PropType, onMounted } from 'vue'
import type { IAction } from '../after/options'

export default defineComponent({
  components: {},
  name: 'Actions',
  props: {
    data: {
      type: Array as PropType<IAction[]>,
      default: () => []
    },
    typeList: {
      type: Array as PropType<IListDataForType[]>,
      default: () => []
    },
    whetherAfter: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const currentAction = ref(1)
    const list = ref<IAction[]>([])

    function onSwitch(item: IAction) {
      currentAction.value = item.type
      emit('onSwitch', item)
    }

    function processData() {
      for (const i of props.typeList) {
        if (i.count > 0) {
          list.value.push(props.data[i.type - 1])
        }
      }
      console.log('%c [ list.value ]-36', 'font-size:13px; background:#0095FF; color:white;', list.value)
    }

    onMounted(() => {
      processData()
    })

    return {
      currentAction,
      list,
      onSwitch
    }
  }
})
</script>
<template>
  <div class="actions">
    <template v-if="!whetherAfter">
      <div v-for="(item, index) in list" :key="item.type" @click="onSwitch(item)" :class="['action', { isSelected: currentAction === item.type }]">
        <div class="icon-item">
          <img :src="item.icon" alt="" width="40" />
          <div>{{ item.text }}</div>
        </div>
        <div class="line" v-if="index !== data.length - 1"></div>
      </div>
    </template>
    <template v-else>
      <!--  -->
    </template>
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
