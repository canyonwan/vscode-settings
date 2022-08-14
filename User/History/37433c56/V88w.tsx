import { deleteEvidenceMenu, queryEvidenceMenuForPage } from '@/api/cause-manage/evidence'
import { IEvidenceGroupType, IEvidenceMenuType } from '@/api/cause-manage/types'
import { BasicModal, useModal } from '@/components/modal'
import { BasicTable, TableAction } from '@/components/table'
import { NButton, NCard, NInput, NSpace, useDialog } from 'naive-ui'
import useDynamicComp from '@/views/cause-library/manage/options'
import { tableColumns } from '@/views/cause-library/evidence/menu/table-options'

export default defineComponent({
  name: 'EvidenceMenuIndex',
  emits: ['okSubmitBindEvidenceMenu', 'cancelSelectEvidenceMenu'],
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
  setup(props, { emit }) {
    const state = reactive({
      searchParams: {
        name: '',
        page: 1
      },
      evidenceMenuList: [] as IEvidenceMenuType[],
      checkedKeys: [] as string[],
      evidenceMenuItem: {} as IEvidenceMenuType // 证据清单item-编辑的时候传入
    })
    const tableRef = ref()

    const [modalRegister, { openModal, closeModal, setProps }] = useModal({
      title: '',
      displayDirective: 'if'
    })

    const { currentComp, onSwitchComp } = useDynamicComp()

    // 创建操作列
    const actionColumn = {
      width: 120,
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
          label: '编辑',
          onClick: editMenu.bind(null, record)
        },
        {
          type: 'error',
          label: '删除',
          onClick: deleteMenu.bind(null, record)
        },
        {
          type: 'success',
          label: '新增子清单',
          onClick: addEvidenceMenu.bind(null, record.id, '1')
        }
      ]
    }
    // 分页获取所有清单
    const loadTableData = async (page: any) => {
      return await queryEvidenceMenuForPage({ ...state.searchParams, ...page })
    }

    // 刷新
    function reloadTable() {
      tableRef.value.reload()
    }

    // 名称搜索
    const onSearch = () => {
      reloadTable()
    }

    // 编辑清单
    const editMenu = (record: IEvidenceMenuType) => {
      setProps({ title: '编辑清单' })
      openModal()
      onSwitchComp(14)
      state.evidenceMenuItem = { ...record }
    }

    const dialog = useDialog()

    // 删除清单
    const deleteMenu = async (record: IEvidenceMenuType) => {
      dialog.error({
        title: '提示',
        content: '你确定要删除吗？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
          await deleteEvidenceMenu(record.id!)
          reloadTable()
        }
      })
    }

    // 新增子清单
    const addEvidenceMenu = (parentId = '0') => {
      state.evidenceMenuItem = {
        parentId: parentId,
        name: '',
        whetherRequire: 0,
        whetherGroup: 0,
        groupMiniRequire: 0,
        tips: '',
        provMatters: '',
        orderId: 0,
        relaEvidenceType: '',
        remarks: ''
      }
      setProps({ title: parentId === '0' ? '新增清单' : '新增子清单' })

      onSwitchComp(14)
      openModal()
    }

    // 取消绑定证据清单
    const onCancel = () => {
      emit('cancelSelectEvidenceMenu')
    }

    // 确定绑定
    const submitBindEvidenceMenu = () => {
      emit('okSubmitBindEvidenceMenu', state.checkedKeys)
      state.checkedKeys.length = 0
    }

    // 新增证据清单后的回调
    const okSaveEvidenceMenuHandler = () => {
      reloadTable()
      closeModal()
    }

    watch(
      () => props.useSelection,
      () => {
        if (props.useSelection) {
          if (tableColumns.at(0)!.type !== 'selection') {
            tableColumns.unshift({
              type: 'selection'
            })
          }
          state.checkedKeys = props.boundKeys || []
          debugger
        } else {
          if (tableColumns.at(0)!.type === 'selection') {
            tableColumns.shift()
          }
        }
      },
      {
        immediate: true
      }
    )

    return () => (
      <div>
        <NCard bordered={false}>
          <BasicTable
            row-key={(row: IEvidenceGroupType) => row.id}
            v-model:checkedRowKeys={state.checkedKeys}
            request={loadTableData}
            ref={tableRef}
            columns={tableColumns}
            action-column={!props.useSelection ? actionColumn : null}
            scroll-x={1800}
          >
            {{
              tableTitle: () => (
                <NSpace>
                  <NInput clearable placeholder="请输入清单名称" v-model:value={state.searchParams.name}></NInput>
                  <NButton type="primary" onClick={onSearch}>
                    查询
                  </NButton>
                </NSpace>
              ),
              toolbar: () =>
                props.useSelection || (
                  <NButton type="success" onClick={() => addEvidenceMenu('0')}>
                    新增证据清单
                  </NButton>
                )
            }}
          </BasicTable>
          <div class="pt-4 text-right" v-show={props.useSelection}>
            <NButton class="ml-2" onClick={onCancel}>
              取消
            </NButton>
            <NButton class="ml-2" onClick={submitBindEvidenceMenu} type="primary">
              确定绑定
            </NButton>
          </div>
        </NCard>
        <BasicModal onRegister={modalRegister} style={{ width: '60%' }}>
          {h(currentComp.value, { onOkSaveEvidenceMenu: okSaveEvidenceMenuHandler, evidenceMenuItem: state.evidenceMenuItem, onCancelModalHandler: () => closeModal() })}
        </BasicModal>
      </div>
    )
  }
})
