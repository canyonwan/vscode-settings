<script setup lang="ts">
  import { deleteTimelineNode } from '@/api/program/program'
  import type { ISaveTimelineNodeParams, ITimeLineTreeLeaf } from '@/api/program/types'
  import { useModal } from '@/components/modal'
  import { EllipsisVertical } from '@vicons/ionicons5'
  import { useDialog } from 'naive-ui'
  import type { Ref } from 'vue'
  import NodeLeaf from '@/views/program/components/node-leaf.vue'
  import saveTimelineNode from '@/views/program/components/save-timeline-node.vue'
  import singleDeleteList from '@/views/program/components/single-delete-list.vue'

  const props = defineProps({
    itemNode: {
      type: Object as PropType<ITimeLineTreeLeaf>,
      default: () => {},
      required: true
    }
  })

  const emits = defineEmits(['emitWidth', 'handleRefreshTimeTree', 'nodeClick'])

  const dialog = useDialog()
  const [modalRegister, { openModal, closeModal, setProps }] = useModal({ title: '新增同级节点', displayDirective: 'if' })
  const [singleDeleteModalRegister, { openModal: openSingleDeleteListModal }] = useModal({ title: '删除节点', displayDirective: 'if' })

  const saveTimelineNodeInfo = ref<ISaveTimelineNodeParams>()
  const injectProgramId = inject<Ref<string>>('provideProgramId')

  const dropdownMenuOptions = ref([
    {
      label: '添加同级节点',
      key: 'add-same-level',
      nodeType: '1'
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

  function saveNode(nodeType: string) {
    setProps({
      title: `添加${nodeType === '1' ? '同级' : '子级'}节点`
    })
    saveTimelineNodeInfo.value = {
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
      negativeText: ![4, 7, 9, 5, 6].includes(props.itemNode.toolType) && props.itemNode.childrenList?.length > 0 ? '单个删除' : '',
      onPositiveClick: async () => {
        await deleteTimelineNode({
          deleteType: 1,
          timeLineIdList: [{ timeLineId: props.itemNode.id }]
        })
        emits('handleRefreshTimeTree')
      },
      onNegativeClick: ![4, 7, 9, 5, 6].includes(props.itemNode.toolType) ? () => openSingleDeleteListModal() : () => null
    })
  }

  // 按钮点击
  function handleClick(node) {
    emits('nodeClick', node)
  }

  onMounted(() => {
    if (![4, 7, 9, 5, 6].includes(props.itemNode.toolType))
      dropdownMenuOptions.value.splice(1, 0, {
        label: '添加子级节点',
        key: 'add-child',
        nodeType: '0'
      })
  })
</script>
<template>
  <div class="timeline-item flex p-4 ml-12 mr-4 mb-6">
    <!-- 阶段按钮 -->
    <!-- <div class="e-button cursor-pointer" @click="handleClick(props.itemNode)">
      <div class="flex items-center justify-between text-sm">
        <n-ellipsis style="max-width: 240px" class="text-xs"> {{ props.itemNode.title }}</n-ellipsis>
        <n-dropdown trigger="hover" :options="dropdownMenuOptions" :show="showDropdown" show-arrow @select="handleSelect">
          <n-icon :component="EllipsisVertical" color="#7bdfe7" class="cursor-pointer" @mouseenter="() => (showDropdown = true)" />
        </n-dropdown>
      </div>
    </div> -->
    <div class="e-button cursor-pointer" @click="handleClick(props.itemNode)">
      <div class="flex items-center justify-between text-sm">
        <n-ellipsis style="max-width: 240px" class="text-xs"> {{ props.itemNode.title }}</n-ellipsis>
        <n-dropdown trigger="hover" :options="dropdownMenuOptions" show-arrow @select="handleSelect">
          <n-icon :component="EllipsisVertical" color="#7bdfe7" class="cursor-pointer" />
        </n-dropdown>
      </div>
    </div>

    <!-- 递归timeline -->
    <div class="flex">
      <div class="flex flex-col px-2" v-for="(timelineNode, idx) in props.itemNode.childrenList" :key="timelineNode.id">
        <node-leaf :item-node="timelineNode" :idx="idx" :parentChildrenLength="props.itemNode.childrenList.length" />
      </div>
    </div>

    <!-- Modal -->
    <basic-modal @register="modalRegister" style="width: 50%">
      <save-timeline-node :saveTimelineNodeInfo="saveTimelineNodeInfo" @handleSaveNode="handleSaveNode" />
    </basic-modal>
    <basic-modal @register="singleDeleteModalRegister" style="width: 50%">
      <single-delete-list :children="props.itemNode.childrenList" @handleSaveNode="handleSaveNode" />
    </basic-modal>
  </div>
</template>
<style scoped lang="less">
  .e-button {
    // max-width: 140px;
    background: #152a4b;
    box-shadow: inset 0px -6px 10px 1px rgba(71, 155, 221, 0.6), inset 0px 6px 10px 1px rgba(71, 155, 221, 0.6);
    padding: 8px 16px;
    border-radius: 6px;
    border: 1.5px solid #7bdfe7;
  }
</style>
