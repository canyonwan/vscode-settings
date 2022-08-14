<template>
  <div class="publicity-before">
    <actions :data="typeList" @onSwitch="switchHandler" />
    <law-enforcer :orgId="$props.orgId" v-if="showType === 1"></law-enforcer>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import lawEnforcer from './components/law-enforcer.vue'
import Actions from '../components/actions.vue'

export default defineComponent({
  components: { lawEnforcer, Actions },
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

    function switchHandler() {
      //
    }
    return {
      ...toRefs(state),
      selectType,
      switchHandler
    }
  }
})
</script>
<style lang="less" scoped>
.publicity-before {
  width: 100%;
}
</style>
