<template>
  <div class="tool-action text-gray-50">
    <div v-for="group in toolGroups" :key="group.id!">
      <!-- displayJudgeExpressionGroups 是否显示，为空不用判断即显示 -->
      <div v-if="group.currentPermissionsIsRelease && judgeExpress(group, 1)" :disabled="judgeExpress(group, 2)">
        <div v-if="group && group.tools && group.tools.length" class="mb-10">
          <!-- 判断是否可用, 按钮disabled为true时禁用。false时可用。所以是!judgeExpress(tool, 2) -->
          <n-button text color="#8dc5ff" class="mt-2 mb-5 block text-sm" :disabled="isDisabled || !judgeExpress(group, 2)"> {{ group.name }}</n-button>
          <n-space v-for="tool in group.tools" :key="tool!.id!" inline :class="['mr-4', !isDisabled && !group.disabled && judgeExpress(tool, 2) ? 'cursor-pointer' : 'cursor-not-allowed']">
            <div v-if="tool && tool.currentPermissionsIsRelease && judgeExpress(tool, 1)">
              <!-- PC端不能做的提示 -->
              <n-popover
                placement="bottom"
                trigger="click"
                :show-arrow="false"
                :style="{ maxWidth: '240px', backgroundColor: '#ffffff', color: '#ffffff' }"
                v-if="tool.type && [6].includes(tool.type)"
              >
                <template #trigger>
                  <!-- @click="onClick(tool)" -->
                  <!-- <n-button class="mb-2 text-gray-200" :disabled="isDisabled || group.disabled || !judgeExpress(tool, 2)">
                    {{ tool.name }}
                  </n-button> -->
                  <!-- <div class="flex items-center" :disabled="isDisabled || group.disabled || !judgeExpress(tool, 2)"> -->
                  <div :class="[{ 'cursor-not-allowed': isDisabled || group.disabled || !judgeExpress(tool, 2) }, 'flex items-center']">
                    <n-icon size="20" color="#8E9DA6" v-if="tool.webFileName" class="mr-2">
                      <e-svg-icon :name="tool.webFileName" />
                    </n-icon>
                    <div class="text-textColorDisable">
                      {{ tool.name }}
                    </div>
                  </div>
                </template>
                <div class="text-gray-900">该工具电脑端暂不支持使用,请到手机端APP使用</div>
                <div class="n-popover-arrow-wrapper"><div class="n-popover-arrow" style="background-color: #fff"></div></div>
              </n-popover>
              <div
                v-else
                @click="onClick(tool)"
                :class="[
                  'mb-2 items-center flex py-1 px-3 rounded-lg',
                  !isDisabled && !group.disabled && judgeExpress(tool, 2) ? 'action-button pointer-events-auto ' : 'text-gray-600  border  border-gray-600 pointer-events-none'
                ]"
              >
                <!-- <n-icon v-if="tool.webIconFileInfo" id="icon" class="mr-2" color="#0e7a0d">
                </n-icon> -->
                <n-icon size="20" :color="!isDisabled && !group.disabled && judgeExpress(tool, 2) ? '#71bfeb' : '#999999'" v-if="tool.webFileName" class="mr-2">
                  <e-svg-icon :name="tool.webFileName" />
                </n-icon>
                {{ tool.name }}
              </div>
              <!-- <n-button v-else @click="onClick(tool)" class="mb-2 text-gray-200" :disabled="isDisabled || group.disabled || !judgeExpress(tool, 2)">
                {{ tool.name }}
              </n-button> -->
            </div>
          </n-space>
        </div>
        <tool-action :toolGroups="group.toolGroups" v-if="group.toolGroups && group.toolGroups.length" :isDisabled="$props.isDisabled" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { IModelToolGroup } from '@/api/workflow/types'
  import { handleJudge } from './judge'

  export default defineComponent({
    name: 'ToolAction',
    props: {
      // 模型组
      toolGroups: {
        type: Array as PropType<IModelToolGroup[]>,
        default: () => {
          return []
        }
      },
      // 是否禁用
      isDisabled: {
        type: Boolean,
        default: false
      },
      // 工具关键字
      keyWordValueList: {
        type: Object,
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
      }
    },
    emits: ['toolInfo'],
    setup(props, context) {
      const state = reactive({
        currentId: '' // 当前工具组
      })

      const onClick = async (toolInfo) => {
        context.emit('toolInfo', toolInfo)
      }

      // expressType 表达式组类型； 1是否显示判定表达式组displayJudgeExpressionGroups 2是否可用表达式组availableJudgeExpressionGroups
      const judgeExpress = (data, expressType) => {
        return handleJudge(data, props.keyWordValueList, props.judgeOptions, props.logicOptions, expressType)
      }

      return {
        judgeExpress,
        ...toRefs(state),
        onClick
      }
    }
  })
</script>

<style lang="less" scoped>
  .action-button {
    // padding: 6px 12px;
    border-radius: 8px;
    background: #041c35;
    opacity: 1;
    border: 1px solid #26598a;
    &:hover {
      box-shadow: inset 0px 6px 10px 0px rgba(71, 155, 221, 0.6), inset 0px -6px 10px 0px rgba(71, 155, 221, 0.6);
      transition: ease-out 0.4s;
    }
  }
</style>
