<script setup lang="ts">
  import { deleteTimelineNode } from '@/api/program/program'
  import type { ISaveTimelineNodeParams, ITimeLineTreeLeaf } from '@/api/program/types'
  import { useModal } from '@/components/modal'
  import { EllipsisHorizontal, CheckmarkCircle, EllipseOutline } from '@vicons/ionicons5'
  import { useDialog } from 'naive-ui'
  import { Ref } from 'vue'
  import saveTimelineNode from './save-timeline-node.vue'
  import singleDeleteList from './single-delete-list.vue'

  const props = defineProps({
    itemNode: {
      type: Object as PropType<ITimeLineTreeLeaf>,
      default: () => {},
      required: true
    },
    ids: {
      type: Array as PropType<string[]>,
      default: () => []
    }
  })
  const emits = defineEmits(['emitWidth', 'handleRefreshTimeTree'])

  const dialog = useDialog()
  const [modalRegister, { openModal, closeModal, setProps }] = useModal({ title: '新增同级节点', displayDirective: 'if' })
  const [singleDeleteModalRegister, { openModal: openSingleDeleteListModal }] = useModal({ title: '删除节点', displayDirective: 'if' })

  const itemEl = ref<null>(null)
  const leftDividerRef = ref<HTMLElement | null>(null)

  // 获取单项大小
  const { width } = useElementSize(itemEl)
  const { width: leftDividerWidth } = reactive(useElementSize(leftDividerRef))

  const dropdownMenuOptions = [
    {
      label: '添加同级节点',
      key: 'add-same-level',
      nodeType: '1'
    },
    {
      label: '添加子级节点',
      key: 'add-child',
      nodeType: '0'
    },
    {
      label: '删除节点',
      key: 'delete'
    }
  ]

  // 节点操作
  function handleSelect(_: string, options: any) {
    switch (options.key) {
      case 'add-same-level':
        saveNode(options.nodeType)
        break
      case 'add-child':
        saveNode(options.nodeType)
        break
      case 'delete':
        handleConfirm()
        break
    }
  }

  const savetimelineNodeInfo = ref<ISaveTimelineNodeParams>()
  const injectProgramId = inject<Ref<string>>('provideProgramId')

  function saveNode(nodeType: string) {
    setProps({
      title: `添加${nodeType === '1' ? '同级' : '子级'}节点`
    })
    savetimelineNodeInfo.value = {
      nodeType,
      timeLineId: props.itemNode.id,
      procedureId: unref(injectProgramId)!
    }
    openModal()
  }

  function handleSaveNode() {
    closeModal()
    emits('handleRefreshTimeTree')
  }

  // 节点删除
  function handleConfirm() {
    dialog.warning({
      title: '温馨提示',
      content: `您要删除该节点内全部内容还是单个内容？\n删除后可以"工具箱-回收站"内查找恢复`,
      positiveText: '全部删除',
      negativeText: '单个删除',
      onPositiveClick: async () => {
        await deleteTimelineNode({
          deleteType: 1,
          timeLineIdList: [{ timeLineId: props.itemNode.id }]
        })
        emits('handleRefreshTimeTree')
      },
      onNegativeClick: () => openSingleDeleteListModal()
    })
  }

  watch(
    () => [width.value, leftDividerWidth],
    () => {
      emits('emitWidth', {
        id: props.itemNode.id,
        width: width.value,
        leftDividerWidth: leftDividerWidth
      })
    }
  )
</script>

<template>
  <div ref="itemEl">
    <n-space align="center">
      <!-- left divider -->
      <n-space vertical align="center" ref="leftDividerRef" v-if="props.ids.includes(props.itemNode.id)">
        <n-divider vertical />
        <n-divider vertical />
        <n-divider vertical />
        <img class="animate-bounce" src="@/assets/icons/down_arrow_icon.svg" alt="multi_arrow_icon" />
        <n-divider vertical />
        <n-divider vertical />
      </n-space>
      <!-- content -->
      <n-space vertical>
        <n-divider dashed title-placement="left" style="height: 20px">
          <img class="animate-pulse" v-show="props.ids.includes(props.itemNode.id)" src="@/assets/icons/multi_arrow_icon.svg" alt="multi_arrow_icon" />
        </n-divider>
        <div class="timeline-item bg-darkPrimary p-6 rounded-lg mr-4">
          <n-space justify="space-between" align="center">
            <div class="leading-10 px-4 text-center align-middle text-white cursor-pointer bg-e-button-bg bg-no-repeat bg-full">{{ props.itemNode.title }}</div>
            <n-dropdown trigger="click" :options="dropdownMenuOptions" :show-arrow="true" @select="handleSelect">
              <n-icon :component="EllipsisHorizontal" class="cursor-pointer" />
            </n-dropdown>
          </n-space>
          <!-- timeline -->
          <n-space>
            <n-space class="py-5" align="center" v-for="(timelineNode, index) in props.itemNode.childrenList" :key="timelineNode.id">
              <n-button text>
                <template #icon>
                  <n-icon v-if="timelineNode.nodeStatus === 0" :component="EllipseOutline" color="#88E2DC" />
                  <svg class="animate-spin" v-else-if="timelineNode.nodeStatus === 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">
                    <defs />
                    <path d="M7.7 4.7a14.7 14.7 0 0 0-3 3.1L6.3 9a13.26 13.26 0 0 1 2.6-2.7z" fill="currentColor" />
                    <path d="M4.6 12.3l-1.9-.6A12.51 12.51 0 0 0 2 16h2a11.48 11.48 0 0 1 .6-3.7z" fill="currentColor" />
                    <path d="M2.7 20.4a14.4 14.4 0 0 0 2 3.9l1.6-1.2a12.89 12.89 0 0 1-1.7-3.3z" fill="currentColor" />
                    <path d="M7.8 27.3a14.4 14.4 0 0 0 3.9 2l.6-1.9A12.89 12.89 0 0 1 9 25.7z" fill="currentColor" />
                    <path d="M11.7 2.7l.6 1.9A11.48 11.48 0 0 1 16 4V2a12.51 12.51 0 0 0-4.3.7z" fill="currentColor" />
                    <path d="M24.2 27.3a15.18 15.18 0 0 0 3.1-3.1L25.7 23a11.53 11.53 0 0 1-2.7 2.7z" fill="currentColor" />
                    <path d="M27.4 19.7l1.9.6A15.47 15.47 0 0 0 30 16h-2a11.48 11.48 0 0 1-.6 3.7z" fill="currentColor" />
                    <path d="M29.2 11.6a14.4 14.4 0 0 0-2-3.9l-1.6 1.2a12.89 12.89 0 0 1 1.7 3.3z" fill="currentColor" />
                    <path d="M24.1 4.6a14.4 14.4 0 0 0-3.9-2l-.6 1.9a12.89 12.89 0 0 1 3.3 1.7z" fill="currentColor" />
                    <path d="M20.3 29.3l-.6-1.9a11.48 11.48 0 0 1-3.7.6v2a21.42 21.42 0 0 0 4.3-.7z" fill="currentColor" />
                  </svg>
                  <n-icon v-else-if="timelineNode.nodeStatus === 2" :component="CheckmarkCircle" color="#88E2DC" />
                </template>
                <div class="text-xs">{{ timelineNode.title }}</div>
              </n-button>
              <div class="c-border" v-if="index !== props.itemNode.childrenList.length - 1"></div>
              <!-- 文件 -->
              <n-space>
                <div v-for="file in timelineNode?.fileList" :key="file.fileId" class="ml-5 w-16 py-2">
                  <!-- img -->
                  <div v-if="file.fileType === 1" class="w-16">
                    <img :src="file.fileUrl" alt="placeholder" />
                  </div>
                  <!-- video -->
                  <div v-else-if="file.fileType === 5" class="w-16">
                    <video :src="file.fileUrl"></video>
                  </div>
                </div>
              </n-space>
            </n-space>
          </n-space>
        </div>
      </n-space>
    </n-space>
    <basic-modal @register="modalRegister" style="width: 50%">
      <save-timeline-node :savetimelineNodeInfo="savetimelineNodeInfo" @handleSaveNode="handleSaveNode" />
    </basic-modal>
    <basic-modal @register="singleDeleteModalRegister" style="width: 50%">
      <single-delete-list :children="props.itemNode.childrenList" @handleSaveNode="handleSaveNode" />
    </basic-modal>
  </div>
</template>
<style lang="less" scoped>
  .c-border {
    height: 0px;
    width: 40px;
    border-style: dashed;
    border-color: #619c98;
    border-width: 1px 0 0;
  }
</style>
