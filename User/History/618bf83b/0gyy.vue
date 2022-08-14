<template>
  <basic-form @register="register" @submit="onSubmit" @close-modal="onCancelModal">
    <template #keyPointScoreSlot="{ model }">
      <n-space vertical v-if="model['selectType'] === 2">
        <n-space v-for="(item, index) in discretionLevelOrScoreItem" :key="item.discretionLevel">
          <p>裁量等级或分值: </p>
          <n-input-number style="width: 100px" v-model:value="item.discretionLevel" />
          <p>违反任意</p>
          <n-space v-for="(ele, eleIndex) in item.criteriaList" :key="ele">
            <n-input-number v-model:value="item.criteriaList[eleIndex]" style="width: 100px" />
            <n-icon size="24" color="red" @click="item.criteriaList.splice(eleIndex, 1)">
              <CloseCircleFilled />
            </n-icon>
          </n-space>
          <p>个项</p>
          <n-icon size="26" color="green" @click="addCriteria(item)">
            <AddOutline />
          </n-icon>
          <n-icon size="26" color="red" @click="deleteDiscretionLevel(index)">
            <Close />
          </n-icon>
        </n-space>
        <n-button type="primary" @click="addDiscretionLevel">
          <n-icon size="18">
            <PlusOutlined />
          </n-icon>
          新增
        </n-button>
      </n-space>
    </template>
  </basic-form>
</template>

<script lang="ts">
  import schemaDataHandle from '@/hooks/custom-form-data-handle'
  import { schemas } from './schemas'
  import { useForm } from '@/components/form'
  import { IDiscretionMenuType, IDiscretionScoreConfType } from '@/api/cause-manage/types'
  import { CloseCircleFilled, PlusOutlined } from '@vicons/antd'
  import { AddOutline, Close } from '@vicons/ionicons5'
  import { saveDiscretionMenu } from '@/api/cause-manage/discretion'
  export default defineComponent({
    name: 'SaveDiscretionMenu',
    components: {
      AddOutline,
      CloseCircleFilled,
      PlusOutlined,
      Close
    },
    props: {
      currentRowData: {
        type: Object as PropType<IDiscretionMenuType>,
        default: () => {}
      }
    },
    emits: ['submitHandler', 'cancelModalHandler'],
    setup(props, { emit }) {
      const schemasForm = ref(schemas)
      schemaDataHandle(schemasForm.value)

      const [register, { setFieldsValue, resetFields }] = useForm({
        gridProps: { cols: 2 },
        labelWidth: 100,
        layout: 'horizontal',
        submitButtonText: '提交',
        schemas: schemasForm.value,
        showCancelButton: true
      })
      const state = reactive({
        discretionLevelOrScoreItem: [] as IDiscretionScoreConfType[],
        addSubItemData: {}
      })

      // 提交
      const onSubmit = async (values: IDiscretionMenuType) => {
        let params: IDiscretionMenuType = {
          ...values,
          ...props.currentRowData,
          sortId: 0,
          discretionScoreConf: state.discretionLevelOrScoreItem,
          relaEvidenceType: values.relaEvidenceType?.join(',')
        }
        console.log('params', props.currentRowData)
        // 如果没有id 是新增
        // 如果有addSubItem 是新增子的 需要id的
        // if (!props.currentRowData.id || props.currentRowData?.addSubItem) {
        //   delete params.id
        //   params.parentId = props.currentRowData?.id || '0'
        // }
        await saveDiscretionMenu(params)
        emit('submitHandler')
      }

      // 取消
      function onCancelModal() {
        emit('cancelModalHandler')
      }

      // 新增裁量等级或分值
      const addDiscretionLevel = () => {
        state.discretionLevelOrScoreItem.push({
          discretionLevel: 0,
          criteriaList: []
        })
      }

      // 删除裁量等级或分值
      const deleteDiscretionLevel = (index: number) => {
        state.discretionLevelOrScoreItem.splice(index, 1)
      }

      // 新增标准
      const addCriteria = (item: any) => {
        item.criteriaList.push(0)
      }

      watchEffect(() => {
        if (props.currentRowData.id && !props.currentRowData.addSubItem) {
          setTimeout(() => setFieldsValue({ ...props.currentRowData, relaEvidenceType: props.currentRowData.relaEvidenceType?.split(',') }), 0)
          state.discretionLevelOrScoreItem = props.currentRowData.discretionScoreConf || []
        } else {
          state.addSubItemData['parentId'] = props.currentRowData.id
          state.addSubItemData['addSubItem'] = props.currentRowData.addSubItem
          setTimeout(() => resetFields(), 0)
          state.discretionLevelOrScoreItem.length = 0
        }
      })
      return { ...toRefs(state), register, onSubmit, addCriteria, deleteDiscretionLevel, addDiscretionLevel, onCancelModal }
    }
  })
</script>
