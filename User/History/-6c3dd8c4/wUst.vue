<template>
  <div class="target-manage">
    <n-card :bordered="false" :style="{ height: 'calc(100vh - ' + 150 + 'px)' }">
      <div v-if="isShowTab && toolGroupData && toolGroupData.length" class="w-full flex justify-between flex-1">
        <template v-for="(item, index) in toolGroupData">
          <div
            :key="index"
            class="cursor-pointer w-full flex justify-center"
            style="font-size: 16px"
            :class="{ 'border-b-2 font-semibold': currentGroup === item }"
            :style="{ borderColor: currentGroup === item ? '#6ec7ff' : '', color: currentGroup === item ? '#6ec7ff' : '' }"
            @click="updateType(item)"
            v-if="item.currentPermissionsIsRelease && judgeExpress(item, 1)"
          >
            <div class="pb-2">{{ item.name }}</div>
          </div>
        </template>
      </div>
      <n-scrollbar :style="{ maxHeight: 'calc(100vh - ' + 210 + 'px)' }" class="pr-3">
        <tool-action
          class="m-6"
          :toolGroups="currentGroup.toolGroups"
          v-if="currentGroup.toolGroups && currentGroup.toolGroups.length"
          @tool-info="getToolInfo"
          :logicOptions="logicOptions"
          :judgeOptions="judgeOptions"
          :isDisabled="!judgeExpress(currentGroup, 2)"
          :keyWordValueList="keyWordValueList"
        />
      </n-scrollbar>
    </n-card>
  </div>
</template>

<script lang="ts">
  import ToolAction from './components/tool-action.vue'
  import { IModelToolGroup, IToolInfoExpress } from '@/api/workflow/types'
  import { handleJudge } from './components/judge'
  export default defineComponent({
    components: { ToolAction },
    props: {
      // 模型类型ID 和 程序类型ID一样

      // 模型中最顶层的工具组数据
      toolGroupData: {
        type: Array as PropType<IModelToolGroup[]>,
        default: () => {
          return []
        }
      },
      // 工具组中第一个判断能显示的子工具组
      currentGroupData: {
        type: Object as PropType<IModelToolGroup>,
        default: () => {
          return {}
        }
      },
      // 连接方式
      logicOptions: {
        type: Array,
        default: () => {
          return []
        }
      },
      // 运算符列表
      judgeOptions: {
        type: Array,
        default: () => {
          return []
        }
      },
      // 是否显示切换
      isShowTab: {
        type: Boolean,
        default: true
      },
      // 工具关键字
      keyWordValueList: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    emits: ['toolInfo', 'onClick', 'toolClick'],
    setup(props, context) {
      const state = reactive({
        currentToolData: {} as IToolInfoExpress, // 当前点击的工具的数据
        currentGroup: {} as IModelToolGroup // 当前工具组
      })

      const updateType = async (value) => {
        state.currentGroup = value
      }

      // 点击工具的回调
      const getToolInfo = (toolInfo) => {
        state.currentToolData = toolInfo
        if (toolInfo && toolInfo.type === 6) {
          // message.warning('该工具电脑端暂不支持使用,请到手机端APP使用')
        } else {
          context.emit('toolClick', true, state.currentToolData)
        }
      }
      // 判定表达式的判断
      const judgeExpress = (data, expressType) => {
        return handleJudge(data, props.keyWordValueList, props.judgeOptions, props.logicOptions, expressType)
      }
      watch(
        () => props.currentGroupData,
        () => {
          state.currentGroup = props.currentGroupData
        },
        {
          immediate: true
        }
      )
      return {
        judgeExpress,
        ...toRefs(state),
        updateType,
        getToolInfo
      }
    }
  })
</script>
