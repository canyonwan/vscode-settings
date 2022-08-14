<template>
  <div class="law-tag">
    <n-space justify="end" class="mb-4">
      <n-button
        v-if="!useCheck && buttonShowPermission(frontEndIdentification[0] ? [frontEndIdentification[0]] : [])"
        @click="addTopLevelTag"
        type="primary"
        :disabled="buttonDisabledPermission(frontEndIdentification[0] ? [frontEndIdentification[0]] : [])"
      >
        新增顶级
      </n-button>
    </n-space>
    <n-tree
      block-line
      key-field="id"
      :data="lawTags"
      :checkable="useCheck"
      :children-field="$props.childrenField"
      :render-prefix="renderPrefix"
      :render-suffix="useCheck ? () => [] : renderSuffix"
      :default-expand-all="useCheck"
      @update:checked-keys="updateCheckedKeys"
      :checked-keys="checkedAllKeys"
    />

    <div class="pt-4 text-right" v-if="useCheck">
      <n-button class="ml-2" @click="onCancel">取消</n-button>
      <n-button class="ml-2" @click="handleSubmit" type="primary">确定</n-button>
    </div>
    <basic-modal @register="modalRegister" style="width: 40%">
      <add-tag :request-type="$props.requestType" @on-submit="onSubmit" :current-row="currentRow" :submit-action="submitAction" />
    </basic-modal>
  </div>
</template>

<script lang="ts">
  import { NButton, NEllipsis, useDialog, TreeOption } from 'naive-ui'
  import { useModal } from '@/components/modal'
  import AddTag from './components/add-tag.vue'
  import type { ILawTagType } from '@/api/law/types'
  import { LawEnum } from '@/enums/law-enum'
  import type { TreeOptions } from 'naive-ui/lib/tree/src/interface'
  import { usePermission } from '@/hooks/web/use-permission'
  import { useTreeRadio } from './composables/useTreeRadio'
  export default defineComponent({
    name: 'LawTag',
    components: {
      AddTag,
      NButton
    },
    props: {
      lawData: {
        type: Array as PropType<Array<ILawTagType>>,
        default: () => []
      },
      requestType: {
        type: Number as PropType<LawEnum>,
        default: LawEnum.TYPE
      },
      deleteAction: {
        type: Function as PropType<(...arg: any[]) => Promise<any>>,
        default: null
      },
      submitAction: {
        type: Function as PropType<(...arg: any[]) => Promise<any>>,
        default: null
      },
      useCheck: {
        type: Boolean,
        default: false,
        required: false
      },
      useRadio: {
        type: Boolean,
        default: false,
        required: false
      },
      checkedKeys: {
        type: Array as PropType<Array<string>>,
        default: () => [],
        required: false
      },
      childrenField: {
        type: String,
        default: 'list'
      },
      // 权限代码
      frontEndIdentification: {
        type: Array as PropType<Array<string>>,
        default: () => []
      }
    },
    emits: ['onHandler', 'onCloseModal', 'onSelectOk'],
    setup(props, { emit }) {
      interface IState {
        currentRow: ILawTagType
        checkedAllKeys: string[] // 已选中
        checkedRaw: ILawTagType[] // 已选中的原数据
      }
      const lawTags = ref<ILawTagType[]>([])

      const state = reactive<IState>({
        currentRow: {} as ILawTagType,
        checkedAllKeys: [], // 已选中
        checkedRaw: [] // 已选中的原数据
      })

      // 动态权限
      const { buttonShowPermission, buttonDisabledPermission } = usePermission()

      const dialog = useDialog()
      const [modalRegister, { openModal, closeModal, setProps }] = useModal({
        title: '新增',
        displayDirective: 'if'
      })

      // 获取所有法律标签
      function queryHandler() {
        emit('onHandler')
      }

      // 新增顶级
      // parentId: 0
      function addTopLevelTag() {
        setProps({ title: '新增顶级' })
        state.currentRow = {
          id: undefined,
          parentId: '0',
          name: '',
          remarks: ''
        }
        openModal()
      }

      function onAddSub(option: ILawTagType) {
        setProps({ title: '新增子级' })
        state.currentRow = {
          id: undefined,
          parentId: option.id!,
          name: '',
          remarks: ''
        }
        openModal()
      }

      function onEdit(option: ILawTagType) {
        setProps({ title: '编辑' })
        state.currentRow = {
          id: option.id!,
          parentId: option.parentId,
          name: option.name,
          code: option.code,
          remarks: option.remarks
        }
        openModal()
      }

      // 提交
      function onSubmit() {
        closeModal()
        queryHandler()
      }

      // 删除当前法
      function deleteHandle(option: any) {
        dialog.error({
          title: '提示',
          content: '你确定要删除吗？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: async () => {
            await props.deleteAction(option.id)
            queryHandler()
          }
        })
      }

      function renderLabel({ option }: { option: TreeOption }) {
        return [h(NEllipsis, { style: 'max-width: 300px' }, { default: () => option.name })]
      }

      function renderPrefix({ option }) {
        return h(NEllipsis, { style: 'max-width: 300px' }, { default: () => `${option.name}${option.code ? `-${option.code}-${option.id}` : ''}` })
        // return h(NButton, { text: true, type: 'primary' }, { default: () => option.name })
      }

      function renderSuffix({ option }) {
        return [
          h(
            NButton,
            {
              text: true,
              type: 'primary',
              style: {
                marginRight: '5px',
                display: buttonShowPermission(props.frontEndIdentification[0] ? [props.frontEndIdentification[0]] : []) ? '' : 'none'
              },
              disabled: buttonDisabledPermission(props.frontEndIdentification[0] ? [props.frontEndIdentification[0]] : []),
              onClick: () => onAddSub(option)
            },
            { default: () => '新增' }
          ),
          h(
            NButton,
            {
              text: true,
              type: 'success',
              style: {
                marginRight: '5px',
                display: buttonShowPermission(props.frontEndIdentification[0] ? [props.frontEndIdentification[0]] : []) ? '' : 'none'
              },
              disabled: buttonDisabledPermission(props.frontEndIdentification[0] ? [props.frontEndIdentification[0]] : []),
              onClick: () => onEdit(option)
            },
            { default: () => '编辑' }
          ),
          h(
            NButton,
            {
              text: true,
              type: 'error',
              style: {
                display: buttonShowPermission(props.frontEndIdentification[1] ? [props.frontEndIdentification[1]] : []) ? '' : 'none'
              },
              disabled: buttonDisabledPermission(props.frontEndIdentification[1] ? [props.frontEndIdentification[1]] : []),
              onClick: () => deleteHandle(option)
            },
            { default: () => '删除' }
          )
        ]
      }

      // 更新选中的标签
      function updateCheckedKeys(values: string[], rows: ILawTagType[]) {
        if (props.useRadio) {
          useTreeRadio(rows)
        } else {
          state.checkedAllKeys = values
          state.checkedRaw = rows
        }
      }

      // 确定选择行
      function handleSubmit() {
        emit('onSelectOk', state.checkedAllKeys, state.checkedRaw)
      }

      // 取消选择
      function onCancel() {
        emit('onCloseModal')
      }

      watch(
        () => [props.lawData, props.checkedKeys],
        () => {
          lawTags.value = props.lawData
          state.checkedAllKeys = [...props.checkedKeys]
        },
        {
          immediate: true
        }
      )

      return {
        ...toRefs(state),
        lawTags,
        LawEnum,
        modalRegister,
        addTopLevelTag,
        onCancel,
        onSubmit,
        renderSuffix,
        renderPrefix,
        renderLabel,
        handleSubmit,
        updateCheckedKeys,
        buttonShowPermission,
        buttonDisabledPermission
      }
    }
  })
</script>
