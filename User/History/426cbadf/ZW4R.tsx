import { bindDiscretionMenuForDiscretionGroup, queryDiscretionMenuWithDiscretionGroup } from '@/api/cause-manage/discretion'
import { Ref } from 'vue'
import DiscretionMenuTableIndex from '@/views/cause-library/discretion/menu/home.vue'
import { NAlert, NButton } from 'naive-ui'
import { BasicModal, useModal } from '@/components/modal'
import type { ICommonBindParameterType } from '@/api/cause-manage/types'
import MenuTableList from '@/views/cause-library/discretion/menu/menu-table-list.vue'

export default defineComponent({
  name: 'DiscretionMenuTableForTab',
  setup() {
    const state = reactive({
      boundKeys: [] as string[]
    })

    const tableRef = ref()

    const [modalRegister, { openModal, closeModal }] = useModal({
      title: '绑定裁量清单'
    })

    const injectCurrentDiscretionGroupId: Ref<string> = inject('currentDiscretionGroupId')!

    const loadTable = async () => {
      const res = await queryDiscretionMenuWithDiscretionGroup(unref(injectCurrentDiscretionGroupId))
      state.boundKeys = res.map((item) => item.id!)
      return res
    }

    // 选中回调
    const updateCheckedRowKeys = async (keys: string[]) => {
      const params: ICommonBindParameterType = {
        sourceId: unref(injectCurrentDiscretionGroupId),
        targetList: keys
      }
      await bindDiscretionMenuForDiscretionGroup(params)
      closeModal()
      reload()
    }

    function reload() {
      console.log('menu reload')
      tableRef.value?.reloadTable()
    }

    return {
      ...toRefs(state),
      tableRef,
      reload,
      openModal,
      closeModal,
      loadTable,
      updateCheckedRowKeys,
      modalRegister,
      injectCurrentDiscretionGroupId
    }
  },
  render() {
    const { boundKeys } = this
    return (
      <>
        {this.injectCurrentDiscretionGroupId ? (
          <MenuTableList
            ref="tableRef"
            v-slots={{
              toolbar: () => (
                <NButton type="success" onClick={() => this.openModal()}>
                  新增绑定
                </NButton>
              )
            }}
          />
        ) : (
          <NAlert title="提示" type="info">
            请从左侧选择以查看
          </NAlert>
        )}
        <BasicModal onRegister={this.modalRegister} style="width: 70%">
          <DiscretionMenuTableIndex useSelection boundKeys={boundKeys} onUpdateCheckedRowKeys={this.updateCheckedRowKeys} onCancelBind={() => this.closeModal()} />
        </BasicModal>
      </>
    )
  }
})
