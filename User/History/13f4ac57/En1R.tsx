import { bindEvidenceMenuForEvidenceGroup, queryBoundMenusWithEvidenceGroup } from '@/api/cause-manage/evidence'
import { IEvidenceGroupType, IEvidenceMenuType, IGroupItemType } from '@/api/cause-manage/types'
import { BasicModal, useModal } from '@/components/modal'
import { NButton, useDialog } from 'naive-ui'
import useDynamicComp from '@/views/cause-library/manage/options'
import { BasicTable } from '@/components/table'
import { tableColumns } from '../menu/table-options'

export default defineComponent({
  name: 'EvidenceMenuManage',
  props: {
    evidenceGroupItem: {
      type: Object as PropType<IEvidenceGroupType>,
      default: () => {}
    },
    boundKeys: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    useSelection: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },
  emits: ['okSubmitEvidenceGroup', 'cancelModalHandler', 'cancelBindEvidenceGroup', 'submitBindEvidenceGroupHandler'],
  setup(props) {
    const tableRef = ref()
    const state = reactive({
      evidenceMenuList: [] as IEvidenceMenuType[],
      boundKeys: ['']
    })

    const dialog = useDialog()

    const { currentComp, onSwitchComp } = useDynamicComp()

    const [modalRegister, { openModal, closeModal }] = useModal({
      title: '新增绑定清单',
      displayDirective: 'if'
    })

    // 获取已绑定的证据清单
    const getEvidenceMenuList = async () => {
      const res = await queryBoundMenusWithEvidenceGroup(props.evidenceGroupItem.id!)
      state.evidenceMenuList = res
      state.boundKeys.length = 0
      recursiveSelectedIds(res)
      return res
    }

    function recursiveSelectedIds(res: IEvidenceMenuType[]) {
      res.forEach((item) => {
        if (item.children && item.children.length > 0) {
          state.boundKeys.push(item.id!)
          recursiveSelectedIds(item.children)
        } else {
          state.boundKeys.push(item.id!)
        }
      })
    }

    // 新增绑定
    const addBindMenu = () => {
      openModal()
      onSwitchComp(11)
    }

    // 选择清单回调
    const okBoundHandler = async (keys: string[]) => {
      closeModal()
      await boundEvidenceMenuForEvidenceGroup(keys)
      reload()
    }

    // 为该分组绑定清单
    const boundEvidenceMenuForEvidenceGroup = async (keys: string[]) => {
      const params = {
        sourceId: props.evidenceGroupItem.id,
        targetList: keys
      }
      await bindEvidenceMenuForEvidenceGroup(params)
    }

    // 删除这个已经绑定的清单
    const deleteThisMenu = (id: any) => {
      dialog.error({
        title: '提示',
        content: '你确定要删除吗？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
          state.evidenceMenuList.filter((item) => {
            if (item.id === id) {
              state.evidenceMenuList.splice(state.evidenceMenuList.indexOf(item), 1)
            }
          })
          await boundEvidenceMenuForEvidenceGroup(state.evidenceMenuList.map((item) => item.id!))
        }
      })
    }

    function reload() {
      tableRef.value?.reloadTable()
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
          state.boundKeys = props.boundKeys || []
        } else {
          if (tableColumns.at(0)!.type === 'selection') {
            tableColumns.shift()
          }
        }
      },
      { immediate: true }
    )

    // onMounted(() => getEvidenceMenuList())

    return () => (
      <>
        <NButton type="primary" onClick={addBindMenu} class="mb-6">
          新增绑定清单
        </NButton>
        {/* <NDataTable
          scrollX={1400}
          striped
          singleLine
          singleColumn
          data={state.evidenceMenuList}
          columns={boundMenuTableColumns({
            deleteMenu(row: IGroupItemType) {
              deleteThisMenu(row.id)
            }
          })}
        ></NDataTable> */}
        <BasicTable row-key={(row: any) => row.id} singleLine singleColumn request={getEvidenceMenuList} ref={tableRef} pagination={false} columns={tableColumns} scroll-x={1800}></BasicTable>
        <BasicModal onRegister={modalRegister} style={{ width: '70%' }}>
          {h(currentComp.value, {
            useSelection: true,
            boundKeys: state.boundKeys,
            onOkSubmitBindEvidenceMenu: okBoundHandler,
            onCancelSelectEvidenceMenu: () => closeModal()
          })}
        </BasicModal>
      </>
    )
  }
})
