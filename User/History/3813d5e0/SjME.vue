<template>
  <div class="org-menu">
    <template v-if="treeData && treeData.length">
      <template v-for="(child, key) in treeData" :key="key">
        <div @click.stop="onClick(child)">
          <div
            class="menu"
            :class="
              child.childrenOrganizationInfoOutputs && child.childrenOrganizationInfoOutputs.length
                ? judgeIsOpen(child, 0)
                  ? 'menu-open'
                  : 'menu-close'
                : judgeIsOpen(child, 0)
                ? 'menu-active'
                : 'menu-item'
            "
          >
            {{ child.organizationName }}
          </div>
          <org-menu class="child-group" v-if="judgeIsOpen(child, 0)" :tree-data="child.childrenOrganizationInfoOutputs" @onClick="onClick"></org-menu>
        </div>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { UnitType } from '@/api/subject/org-manage'
import { defineComponent, PropType, reactive } from 'vue'
export default defineComponent({
  name: 'OrgMenu',
  components: {},
  props: {
    treeData: {
      type: Array as PropType<UnitType[]>,
      default: () => {
        return []
      }
    }
  },
  setup(_props, context) {
    const state = reactive({
      selectKeys: [] as string[],
      currentChild: '' // 当前选中子菜单
    })
    const onClick = (nodeInfo: any) => {
      judgeIsOpen(nodeInfo, 1)
      context.emit('onClick', nodeInfo)
    }
    const judgeIsOpen = (nodeInfo: any, type: number) => {
      if (nodeInfo.childrenOrganizationInfoOutputs && nodeInfo.childrenOrganizationInfoOutputs.length) {
        const list = state.selectKeys.filter((item: any) => item === nodeInfo.id) || []
        // type = 1 点击事件 0判断页面显示
        if (type) {
          if (list.length) {
            state.selectKeys = state.selectKeys.filter((item: any) => item !== nodeInfo.id) || []
          } else {
            state.selectKeys.push(nodeInfo.id)
          }
        } else {
          if (list.length) {
            return true
          } else {
            return false
          }
        }
      } else {
        if (type) {
          state.currentChild = nodeInfo.id
        } else {
          if (nodeInfo.id === state.currentChild) {
            return true
          } else {
            return false
          }
        }
      }
    }
    return {
      onClick,
      judgeIsOpen
    }
  }
})
</script>
<style lang="less" scoped>
.org-menu {
  height: auto;
  position: relative;
  .menu {
    cursor: pointer;
    height: 50px;
    line-height: 50px;
  }
  .menu-open {
    color: #ffffff;
    background: #428be0;
    background-repeat: no-repeat;
    background-position: left 180px center;
    background-image: url(../../../assets/publicity-platform/arrow-down.svg);
  }
  .menu-close {
    background: #f0f2f5;
    background-repeat: no-repeat;
    background-position: left 180px center;
    background-image: url(../../../assets/publicity-platform/arrow-right.svg);
  }
  .menu-active {
    color: #0084ff;
    background: #dbeaff;
    border-right: 2px solid #1890ff;
  }
  .menu-item {
    color: #000000;
    background: #ffffff;
    border-right: 0px;
  }
  .child-group {
    display: block;
    max-height: 200px;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .child-group-hidden {
    display: none;
  }
}
</style>
