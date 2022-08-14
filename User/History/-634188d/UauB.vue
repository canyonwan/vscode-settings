<template>
  <div class="publicity-before">
    <div class="types">
      <div class="type-line">
        <div class="type" v-for="item in typeList" :key="item.type" @click="selectType(item.type)">
          <div class="icon-item" :class="{ active: item.type === showType }">
            <div class="icon-image" :style="{ backgroundImage: 'url(' + item.image + ')' }"></div>
            <div class="icon-name">{{ item.name }}</div>
          </div>
          <div class="line"></div>
        </div>
      </div>
    </div>
    <law-enforcer :orgId="$props.orgId" v-if="showType === 1"></law-enforcer>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import lawEnforcer from './components/law-enforcer.vue'
export default defineComponent({
  components: { lawEnforcer },
  name: 'PublicityBefore',
  props: {
    orgId: {
      type: String,
      default: ''
    }
  },
  setup() {
    const state = reactive({
      showType: 1, // 数据显示类型
      typeList: [
        {
          type: 1,
          name: '执法人员',
          image: require('@/assets/publicity-platform/before/zhifarenyuan.svg')
        },
        {
          type: 2,
          name: '执法监督人员',
          image: require('@/assets/publicity-platform/before/zhifajiandurenyuan.svg')
        },
        {
          type: 3,
          name: '执法主体',
          image: require('@/assets/publicity-platform/before/zhifazhuti.svg')
        },
        {
          type: 4,
          name: '执法事项',
          image: require('@/assets/publicity-platform/before/zhifashixiang.svg')
        },
        {
          type: 5,
          name: '执法流程',
          image: require('@/assets/publicity-platform/before/zhifaliucheng.svg')
        }
      ]
    })
    const selectType = (type: number) => {
      state.showType = type
    }
    return {
      ...toRefs(state),
      selectType
    }
  }
})
</script>
<style lang="less" scoped>
.publicity-before {
  width: 100%;
  .types {
    .type-line {
      // display: flex;
      // border: 1px solid #e8e8e8;
      .type {
        flex: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        .icon-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 18px 0;
          // border-right: 2px solid #dfdede;
          .icon-image {
            height: 35px;
            width: 35px;
            background-repeat: no-repeat;
            background-size: cover;
          }
        }
        .line {
          width: 1px;
          height: 58px;
          background: #dfdede;
        }
      }
      .type:last-child {
        .line {
          width: 0px;
        }
      }
    }
    .active {
      background: #edf5ff;
    }
  }
}
</style>
