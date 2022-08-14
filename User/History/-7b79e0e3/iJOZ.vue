<script setup lang="ts">
  import { deleteTimelineNode } from '@/api/program/program'
  import type { ISaveTimelineNodeParams, ITimeLineTreeLeaf } from '@/api/program/types'
  import { useModal } from '@/components/modal'
  import { EllipsisHorizontal } from '@vicons/ionicons5'
  import { useDialog } from 'naive-ui'
  import saveTimelineNode from './save-timeline-node.vue'
  import singleDeleteList from './single-delete-list.vue'
  // import { UseButton as EButton } from '@/components/e-button/use-button'
  import NodeLeaf from './node-leaf.vue'
  import type { Ref } from 'vue'
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
  const emits = defineEmits(['emitWidth', 'handleRefreshTimeTree', 'nodeClick'])

  const dialog = useDialog()
  const [modalRegister, { openModal, closeModal, setProps }] = useModal({ title: '新增同级节点', displayDirective: 'if' })
  const [singleDeleteModalRegister, { openModal: openSingleDeleteListModal }] = useModal({ title: '删除节点', displayDirective: 'if' })

  const itemEl = ref<null>(null)
  const leftDividerRef = ref<HTMLElement>()

  // 获取单项大小
  const { width } = useElementSize(itemEl)
  const { width: leftDividerWidth } = reactive(useElementSize(leftDividerRef))

  const dropdownMenuOptions = ref([
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
  ])

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
    dialog.error({
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

  // 按钮点击
  function handleClick(node) {
    emits('nodeClick', node)
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

  onMounted(() => {
    if ([4, 7, 9, 5, 6].includes(props.itemNode.toolType)) {
      //
      dropdownMenuOptions.value.splice(1, 2)
    } else {
      dropdownMenuOptions.value.splice(1, 0, {
        label: '添加子级节点',
        key: 'add-child',
        nodeType: '0'
      })
    }
  })
</script>

<template>
  <div ref="itemEl">
    <n-space align="center">
      <!-- content -->
      <n-space vertical>
        <n-divider dashed title-placement="left" style="height: 20px">
          <img class="animate-pulse w-16" v-show="props.ids.includes(props.itemNode.id)" src="@/assets/icons/multi_arrow_icon.svg" alt="multi_arrow_icon" />
        </n-divider>
        <div class="timeline-item bg-darkPrimary p-4 rounded-md mr-4">
          <n-space justify="space-between" align="center">
            <e-button type="blue" @click="handleClick(props.itemNode)">
              {{ props.itemNode.title }}
            </e-button>
            <div class="text-red-300" v-show="props.itemNode.toolType === 7">have</div>
            <!-- <div class="bg-e-button-orange-bg leading-10 px-4 text-center align-middle text-white cursor-pointer bg-no-repeat bg-full">
              {{ props.itemNode.title }}
            </div> -->

            <n-dropdown trigger="click" :options="dropdownMenuOptions" :show-arrow="true" @select="handleSelect">
              <n-icon :component="EllipsisHorizontal" class="cursor-pointer" />
            </n-dropdown>
          </n-space>
          <!-- 递归timeline -->
          <n-space>
            <n-space vertical v-for="timelineNode in props.itemNode.childrenList" :key="timelineNode.id">
              <node-leaf :item-node="timelineNode" />
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
