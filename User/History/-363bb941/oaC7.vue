<template>
  <div class="model-choose">
    <n-tabs type="line" @update:value="updateLevel" class="pb-2">
      <n-tab v-for="item in modelLevel" :key="item.id" :name="item.id" :tab="item.name" />
    </n-tabs>
    <div class="flex justify-start items-center">
      <span style="width: 80px">模型类型:</span>
      <n-select class="grid grid-cols-4" v-model:value="currentType" :options="treeData" @update:value="updateModelType" filterable />
    </div>
    <basic-table :columns="columns" :action-column="actionColumn" :request="getModel" ref="tableRef" />
    <div class="flex justify-end items-end mt-5">
      <n-button class="ml-2" @click="cancelModal">取消</n-button>
      <n-button class="ml-2" type="primary" @click="handleSubmit">保存</n-button>
    </div>
  </div>
</template>
<script lang="ts">
  import { useMessage } from 'naive-ui'
  import { columns } from './columns'
  import { TableAction } from '@/components/table'
  import { IModelDataInfo, IModelInfo, IModelNodeConnections, IModelNodeRelation } from '@/api/workflow/types'
  import { queryModelType } from '@/api/workflow/model-type'
  import { queryModelData, queryModelDetail } from '@/api/workflow/model-manage'
  export default defineComponent({
    name: 'ModelChoose',
    components: {},
    props: {
      node: {
        type: Object,
        default: () => {}
      },
      // 已存在的模型信息
      modelInfo: {
        type: Array as PropType<Partial<IModelNodeRelation[]>>,
        default: () => []
      }
    },
    emits: ['update:node', 'selectModel', 'cancelModal'],
    setup(props, context) {
      const tableRef = ref()
      const message = useMessage()
      const state = reactive({
        modelLevel: [
          {
            id: 1,
            name: '主要模型'
          },
          {
            id: 0,
            name: '次要模型'
          }
        ],
        isPrimary: 1, // 主要次要
        treeData: [] as any[],
        modelTyprData: [] as IModelInfo[],
        currentType: '',
        selectKey: '', // 选择的模型key
        addModelData: [] as IModelDataInfo[],
        nodeData: [] as IModelNodeRelation[], // 所有新增节点
        nodeConnections: [] as IModelNodeConnections[], //所有新增的连接
        modelNode: [] as IModelNodeRelation[], // 模型节点
        toolNode: [] as IModelNodeRelation[], // 工具节点
        modelIdsList: [] as string[], // 已选择的模型id集合
        positionX: 10,
        positionY: 10
      })
      const handleSubmit = async () => {
        if (state.selectKey) {
          const list = await queryModelDetail(state.selectKey)
          state.addModelData.push(list)
          if (state.addModelData.length) {
            handleAddNode(state.addModelData)
            state.modelIdsList.push(state.addModelData[0].id as any)
            context.emit('selectModel', { id: state.addModelData[0].id, name: state.addModelData[0].name })
            state.nodeData = [...state.modelNode, ...state.toolNode]
            context.emit('update:node', state.nodeData, state.nodeConnections)
            state.nodeData = []
            state.modelNode = []
            state.toolNode = []
            state.nodeConnections = []
            state.addModelData = []
            state.selectKey = ''
          }
        } else {
          message.warning('请选择模型')
        }
      }
      // 处理选择的模型和工具的节点
      const handleAddNode = (data) => {
        if (data.length) {
          for (const topItem of data) {
            const toolNode = [] as any
            const info = {
              id: topItem.id.toString(),
              type: '1',
              whetherMain: topItem.whetherMain, // whetherMain是否是主要模型
              name: topItem.name,
              x: state.positionX,
              y: state.positionY,
              width: 120,
              height: 60
            } as IModelNodeRelation
            state.modelNode.push(info)
            state.positionX = state.positionX + 150
            handleAddNodeTool(topItem, toolNode, info, topItem.id)
            state.toolNode.push(...toolNode)
            handleConnect(info, toolNode)
            state.positionX = state.positionX + 150
            state.positionY = 10
          }
        }
      }
      // 模型下工具的节点, 工具类型是跳转的才用显示，type=1的
      const handleAddNodeTool = (topItem, toolNode, info, modelId) => {
        state.positionX = state.positionX
        if (topItem.toolGroups && topItem.toolGroups.length) {
          for (const groupItem of topItem.toolGroups) {
            handleAddNodeTool(groupItem, toolNode, info, modelId)
          }
        }
        if (topItem.tools && topItem.tools.length) {
          const list = queryTools(
            topItem.tools.filter((item) => item.type === 1),
            '3',
            topItem.name,
            modelId,
            topItem.id
          )
          toolNode.push(...list)
        }
      }
      // tools工具数组, type节点显示的形状类型, groupName 工具箱组的名称或者工具名称
      const queryTools = (tools, type, groupName, modelId, groupId) => {
        const list = tools.map((item) => {
          const info = {
            // id 是模型id加工具组的id加工具id. 因为不同工具组下边可能有一样的工具
            id: modelId + '&' + groupId + '&' + item.id,
            type: type,
            name: groupName,
            x: state.positionX,
            y: state.positionY,
            width: 120,
            height: 60,
            approvers: [
              {
                id: item.id,
                name: item.name
              }
            ]
          }
          if (state.positionY < 500) {
            state.positionY = state.positionY + 70
          } else {
            state.positionX = state.positionX + 150
            state.positionY = 10
          }
          return info
        })
        return [...list]
      }
      // 处理选择的模型和工具的连接 nodeConnections
      const handleConnect = (modelNode, toolNode) => {
        const listCon = toolNode.map((item) => {
          const info: IModelNodeConnections = {
            id: item.id,
            name: 'Reject',
            type: 'reject',
            // 连接点
            source: {
              id: modelNode.id,
              position: 'right' // 显示的图像，上下左右连接点的位置
            },
            // 被连接点
            destination: {
              id: item.id,
              position: 'left'
            }
          }
          return info
        })
        state.nodeConnections.push(...listCon)
      }
      const cancelModal = () => {
        context.emit('cancelModal')
      }
      const resetInit = async () => {
        const data = await queryModelType({ whetherMain: state.isPrimary })
        state.treeData = data.map((item) => {
          return {
            value: item.id,
            label: item.name
          }
        })
        if (data[0]) {
          state.currentType = data[0] && data[0].id ? data[0].id : ''
          reloadTable({ page: 1 })
        }
      }
      // 查询模型
      const getModel = async (res) => {
        if (state.currentType) {
          return await queryModelData({ ...res, typeId: state.currentType, whetherMain: state.isPrimary })
        }
      }
      // 切换 模型主次
      const updateLevel = (value) => {
        state.isPrimary = value
        resetInit()
      }
      onMounted(() => {
        updateLevel(1)
      })

      // 切换 模型类型
      const updateModelType = (value) => {
        state.currentType = value
        reloadTable({ page: 1 })
      }
      const reloadTable = (param = {}) => {
        // 刷新表单数据
        tableRef.value.reload(param)
      }

      const actionColumn = ref({
        width: 90,
        title: '操作',
        key: 'action',
        fixed: 'right',
        align: 'center',
        render(record) {
          return h(TableAction, {
            style: 'text',
            actions: createActions(record)
          })
        }
      })
      const createActions = (record) => {
        return [
          {
            label: state.selectKey === record.id ? '已选择' : '选择',
            onClick: handleChoose.bind(null, record)
          },
          {
            label: '取消',
            onClick: removeSelect.bind(null, record)
          }
        ]
      }

      // 选择的模型
      const handleChoose = (record) => {
        if (state.modelIdsList.includes(record.id)) {
          message.warning('已存在该模型，请选择其他模型!')
        } else {
          state.selectKey = record.id
        }
      }
      const removeSelect = () => {
        state.selectKey = ''
      }
      watch(
        () => props.modelInfo,
        () => {
          state.modelIdsList = props.modelInfo.map((item: any) => item.id) || []
        },
        {
          immediate: true
        }
      )

      return {
        tableRef,
        columns,
        actionColumn,
        getModel,
        ...toRefs(state),
        updateLevel,
        updateModelType,
        handleSubmit,
        cancelModal
      }
    }
  })
</script>
