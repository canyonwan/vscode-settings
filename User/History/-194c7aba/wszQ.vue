<template>
  <div v-if="Object.keys(causeAttrData).length > 0" class="text-left">
    <template v-for="(item, index) in causeAttrData" :key="index">
      <template v-if="isEdit">
        <n-auto-complete
          :key="index"
          v-model:value="item.defaultValue"
          :placeholder="'请先确定输入模板'"
          :input-props="{ type: 'textarea', autosize: true }"
          :options="item.columnValue"
          v-if="item.columnValue && item.columnValue.length"
          :get-show="
            () => {
              return !item.defaultValue
            }
          "
        />
        <n-input v-model:value="item.defaultValue" autosize type="textarea" :placeholder="item.chineseName" v-else />
      </template>
      <div v-else>{{ item.defaultValue }}</div>
    </template>
  </div>
</template>

<script lang="ts">
  import { IDocumentKeyConfig } from '@/api/document/types'
  import { orderBy } from 'lodash-es'
  export default defineComponent({
    name: 'CauseAttr',
    components: {},
    props: {
      dockeyConfig: {
        // 文书数据
        type: Object as PropType<IDocumentKeyConfig[]>,
        required: true
      },
      modelKeys: {
        // 要渲染的案由key 集合
        type: Array as PropType<String[]>,
        required: true
      },
      isEdit: {
        // 是否编辑
        type: Boolean,
        required: false
      }
    },
    emits: [],
    setup(_props) {
      const state = reactive({
        causeAttrData: [] as IDocumentKeyConfig[]
      })
      onMounted(() => {
        let causeOrder: string[] = []
        state.causeAttrData = _props.dockeyConfig.filter((item) => {
          return _props.modelKeys.includes(item.wordModelKey)
        })
        for (const item of state.causeAttrData) {
          if (item.columnValue && item.columnValue.length > 0) {
            item.columnValue = item.columnValue.map((c) => {
              return {
                label: c.content,
                value: c.content,
                id: c.id
              }
            })
          }
          // 标识案由id 在分组 在按照顺序排序
          item.causeId = item.englishName.match(/^[0-9]*/g)?.[0] || ''
          item.causeId && causeOrder.push(item.causeId)
          item.causeOrder = causeOrder.indexOf(item.causeId)
        }
        state.causeAttrData = orderBy(state.causeAttrData, ['causeOrder', 'sort'])
      })
      return {
        ...toRefs(state)
      }
    }
  })
</script>
