import type { IEvidenceGroupType } from '@/api/cause-manage/types'
import { BasicTable, TableAction } from '@/components/table'
import { BasicModal, useModal } from '@/components/modal'
import { NButton, NCard, NInput, NSpace, useDialog } from 'naive-ui'
import { tableColumns } from '@/views/cause-library/evidence/options'
import { deleteEvidenceGroup, queryEvidenceGroupTable } from '@/api/cause-manage/evidence'
import useDynamicComp from '@/views/cause-library/manage/options'

export default defineComponent({
  name: 'EvidenceGroupIndex',
  props: {
    useSelection: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    boundKeys: {
      type: Array as PropType<string[]>,
      default: () => []
    }
  },
  emits: ['cancelBindEvidenceGroup', 'submitBindEvidenceGroupHandler'],
  setup(props, { emit }) {
    const tableRef = ref()
    const tableColumnOption = ref<any>(tableColumns)
    const state = reactive({
      data: [] as IEvidenceGroupType[],
      evidenceGroupItem: {} as IEvidenceGroupType,
      checkedRowKeys: [] as string[],
      searchParams: {
        name: ''
      }
    })

    const { currentComp, onSwitchComp } = useDynamicComp()

    const [modalRegister, { openModal, closeModal, setProps }] = useModal({
      title: '新增证据分组',
      displayDirective: 'if'
    })

    const dialog = useDialog()

    const loadTableData = async (page: any) => {
      return await queryEvidenceGroupTable({ ...state.searchParams, ...page })
    }

    // 刷新
    function reloadTable() {
      tableRef.value.reload()
    }

    const onSearch = () => {
      loadTableData({ page: 1, size: 10 })
      reloadTable()
    }

    // 创建操作列
    const actionColumn = {
      width: 200,
      title: '操作',
      key: 'action',
      fixed: 'right',
      align: 'center',
      render(record: any) {
        return h(TableAction, {
          style: 'text',
          actions: createActions(record)
        })
      }
    }

    const createActions = (record: any) => {
      return [
        {
          type: 'info',
          label: '编辑分组',
          onClick: editEvidence.bind(null, record)
        },
        {
          type: 'success',
          label: '清单维护',
          onClick: menuManage.bind(null, record)
        },
        {
          type: 'error',
          label: '删除',
          onClick: deleteEvidence.bind(null, record)
        }
      ]
    }

    // 新增证据分组
    const addEvidenceGroup = () => {
      state.evidenceGroupItem.id = ''
      onSwitchComp(13)
      setProps({ title: '新增证据分组' })
      openModal()
    }

    // 编辑证据分组
    const editEvidence = (record: IEvidenceGroupType) => {
      const { id, name, evidenceRuleTypeId, remarks } = record
      onSwitchComp(13)
      setProps({ title: '编辑证据分组' })
      state.evidenceGroupItem = {
        id,
        name,
        remarks,
        evidenceRuleTypeId
      }
      openModal()
    }

    // 已绑定的清单的维护
    const menuManage = (record: IEvidenceGroupType) => {
      onSwitchComp(12)
      setProps({ title: '已绑定的证据清单维护' })
      state.evidenceGroupItem = record
      openModal()
    }

    // 删除分组
    const deleteEvidence = (record: IEvidenceGroupType) => {
      dialog.error({
        title: '提示',
        content: '你确定要删除吗？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
          await deleteEvidenceGroup(record.id!)
          reloadTable()
        }
      })
    }

    const okSubmitEvidenceGroup = () => {
      closeModal()
      reloadTable()
    }

    // 当props.useSelection
    // 取消绑定
    const onCancel = () => {
      emit('cancelBindEvidenceGroup')
    }

    // 当props.useSelection
    // 确定绑定
    const submitBindEvidenceGroup = () => {
      emit('submitBindEvidenceGroupHandler', state.checkedRowKeys)
      state.checkedRowKeys.length = 0
    }

    watch(
      () => props.useSelection,
      () => {
        console.log('watch', props.useSelection)
        if (props.useSelection) {
          if (tableColumnOption.value.at(0)!.type !== 'selection') {
            tableColumnOption.value.unshift({
              type: 'selection'
            })
          }
          state.checkedRowKeys = props.boundKeys || []
        } else {
          if (tableColumnOption.value.at(0)!.type === 'selection') {
            tableColumnOption.value.shift()
          }
        }
      },
      { immediate: true }
    )

    return () => (
      <div>
        <NCard bordered={false}>
          <BasicTable
            rowKey={(row: IEvidenceGroupType) => row.id}
            v-model:checkedRowKeys={state.checkedRowKeys}
            request={loadTableData}
            ref={tableRef}
            columns={tableColumns}
            action-column={!props.useSelection ? actionColumn : {}}
            scroll-x={1800}
          >
            {{
              tableTitle: () => (
                <NSpace>
                  <NInput clearable placeholder="请输入分组名称" v-model:value={state.searchParams.name}></NInput>
                  <NButton type="success" onClick={onSearch}>
                    查询
                  </NButton>
                </NSpace>
              ),
              toolbar:props.useSelection ||  () => (
                <NButton type="primary" onClick={addEvidenceGroup}>
                  新增证据分组
                </NButton>
              )
            }}
          </BasicTable>
          <div v-show={props.useSelection} class="pt-4 text-right">
            <NButton class="ml-2" onClick={onCancel}>
              取消
            </NButton>
            <NButton class="ml-2" onClick={submitBindEvidenceGroup} type="primary">
              确定绑定
            </NButton>
          </div>
        </NCard>
        <BasicModal onRegister={modalRegister} style={{ width: '70%' }}>
          {h(currentComp.value, { onOkSubmitEvidenceGroup: okSubmitEvidenceGroup, onCancelModalHandler: () => closeModal(), evidenceGroupItem: state.evidenceGroupItem })}
        </BasicModal>
      </div>
    )
  }
})
