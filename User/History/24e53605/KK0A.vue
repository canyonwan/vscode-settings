<template>
  <span v-if="!isEdit"> {{ caseColumnData.defaultValue }}</span>
  <n-auto-complete
    :key="caseColumnData.wordModelKey"
    v-model:value="caseColumnData.defaultValue"
    :placeholder="'请选择并完善信息'"
    :input-props="{ type: 'textarea' }"
    :options="caseColumnData.columnValue"
    :get-show="
      () => {
        return !caseColumnData.defaultValue
      }
    "
  />
</template>

<script lang="ts">
  import { IDocumentKeyConfig } from '@/api/document/types'
  export default defineComponent({
    name: 'DocSelectEdit',
    components: {},
    props: {
      caseColumnSource: {
        // 文书数据
        type: Object as PropType<IDocumentKeyConfig>,
        required: true
      },
      isEdit: {
        // 是否编辑
        type: Boolean,
        default: false
      }
    },
    emits: [],
    setup(_props) {
      const state = reactive({
        caseColumnData: {} as IDocumentKeyConfig
      })
      onMounted(() => {
        state.caseColumnData = _props.caseColumnSource
        // 如果有违法行为属性类型，并且columnValue下边有选择，要处理一下选项数据，转成label,value
        if (state.caseColumnData.baseCauseAttId && state.caseColumnData.columnValue.length) {
          state.caseColumnData.columnValue = state.caseColumnData.columnValue.map((item) => {
            return {
              value: item.id,
              label: item.content
            }
          })
        }
      })
      return {
        ...toRefs(state)
      }
    }
  })
</script>

<style lang="less" scoped></style>
