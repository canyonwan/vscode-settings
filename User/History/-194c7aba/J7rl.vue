<template>
  <div v-if="Object.keys(causeAttrData).length > 0" class="text-left">
    <template v-for="(item, index) in causeAttrData" :key="index">
      <!-- 配置判断缩进2 字符 -->
      <span class="pl-8" v-if="item.keyAttributeValues?.includes(9) && !isEdit" :key="index"></span>

      <template v-if="isEdit && !item.keyAttributeValues?.includes(8)">
        <template v-if="item.documentModelDataTypeId === '1000001'">
          <!-- 下拉框选择多选并可编辑 -->
          <doc-select-complete :key="item.wordModelKey" :option-data="item.columnValue" :placeholder="item.description" v-model:default-value="item.defaultValue" :is-edit="isEdit" />
        </template>
        <doc-select-edit v-else-if="item.columnValue && item.columnValue.length" :caseColumnSource="item" :is-edit="isEdit" />
        <!-- 存在描述信息渲染成标题类 -->
        <n-input-group v-else-if="item.description">
          <n-input-group-label>{{ item.description }}:</n-input-group-label>
          <n-input class="min-w-7" autosize v-model:value="item.defaultValue" :type="type" />
        </n-input-group>
        <n-input v-model:value="item.defaultValue" autosize :type="item.keyAttributeValues?.includes(10) ? 'textarea' : 'text'" :placeholder="item.chineseName" v-else />
      </template>
      <template v-else>
        <span :class="{ 'data-underline': item.keyAttributeValues?.includes(2), 'font-semibold': item.keyAttributeValues?.includes(13) }">
          {{ item.defaultValue }}{{ item.keyAttributeValues?.includes(7) ? '：' : '' }}
        </span>
      </template>
      <!-- 符号判断 -->
      <template v-if="item.keyAttributeValues?.includes(11)">
        <span>，</span>
      </template>
      <template v-else-if="item.keyAttributeValues?.includes(12)">
        <span>。</span>
      </template>
      <template v-if="item.keyAttributeValues?.includes(1) || item.keyAttributeValues?.includes(4)">
        <!-- 换行属性 -->
        <br />
        <span class="pl-8" v-if="!isEdit && item.keyAttributeValues?.includes(1)"></span>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
  import { IDocumentKeyConfig } from '@/api/document/types'
  import DocSelectComplete from './doc-select-complete.vue'
  import DocSelectEdit from './doc-select-edit.vue'
  import { orderBy } from 'lodash-es'
  import { useMessage } from 'naive-ui'
  export default defineComponent({
    name: 'CauseApprovalAttr',
    components: { DocSelectComplete, DocSelectEdit },
    props: {
      dockeyConfig: {
        // 文书数据
        type: Object as PropType<IDocumentKeyConfig[]>,
        required: true
      },
      modelKeys: {
        // 要渲染的违法行为key 集合
        type: Array as PropType<String[]>,
        required: true
      },
      isEdit: {
        // 是否编辑
        type: Boolean,
        required: false
      },
      type: {
        // text 类型
        type: String,
        default: 'textarea'
      }
    },
    emits: [],
    setup(_props) {
      const message = useMessage()
      const state = reactive({
        causeAttrData: [] as IDocumentKeyConfig[]
      })
      onMounted(() => {
        let causeOrder: string[] = []
        state.causeAttrData = _props.dockeyConfig.filter((item) => {
          return _props.modelKeys.includes(item.wordModelKey) && item.documentModelDataTypeId !== '1000007' && item.whetherUse === 1
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
          // 标识违法行为id 在分组 在按照顺序排序
          item.causeId = item.englishName.match(/^[0-9]*/g)?.[0] || ''
          item.causeId && causeOrder.push(item.causeId)
          item.causeOrder = causeOrder.indexOf(item.causeId)
          item.sort = _props.modelKeys.indexOf(item.wordModelKey)
        }
        state.causeAttrData = orderBy(state.causeAttrData, ['causeOrder', 'sort'])
      })
      return {
        ...toRefs(state)
      }
    }
  })
</script>
