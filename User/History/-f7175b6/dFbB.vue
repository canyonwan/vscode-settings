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
