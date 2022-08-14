import { bindDiscretionTypeForDiscretionGroup, queryDiscretionTypesWithDiscretionGroup } from '@/api/cause-manage/discretion'
import { Ref } from 'vue'
import DiscretionTypeTable from '@/views/cause-library/discretion/type/home.vue'
import { BasicModal, useModal } from '@/components/modal'
import { NButton } from 'naive-ui'
import type { ICommonBindParameterType } from '@/api/cause-manage/types'
export default defineComponent({
  name: 'DiscretionTypeTableTab',
  setup() {
    const tableRef = ref()
    const boundKeys = ref<string[]>()
    const [modalRegister, { openModal, closeModal }] = useModal({
      title: '绑定裁量类型',
      displayDirective: 'if'
    })

    const injectCurrentDiscretionGroupId: Ref<string> = inject('currentDiscretionGroupId')!

    const loadTable = async () => {
      const res = await queryDiscretionTypesWithDiscretionGroup(unref(injectCurrentDiscretionGroupId))
      boundKeys.value = res.map((item) => item.id!)
      return await queryDiscretionTypesWithDiscretionGroup(unref(injectCurrentDiscretionGroupId))
    }

    // 新增绑定裁量类型
    function bindTypes() {
      openModal()
    }

    // 提交绑定的裁量类型
    async function submitCheckedRowKeys(keys: string[]) {
      closeModal()
      const params: ICommonBindParameterType = {
        sourceId: unref(injectCurrentDiscretionGroupId),
        targetList: keys
      }
      await bindDiscretionTypeForDiscretionGroup(params)
      reload()
    }

    function reload() {
      tableRef.value?.reloadTable()
    }
    return () => (
      <>
        <DiscretionTypeTable
          ref={tableRef}
          loadTableData={loadTable}
          pagination={false}
          useSelection={false}
          v-slots={{
            toolbar: () => (
              <NButton type="success" onClick={bindTypes}>
                绑定裁量类型
              </NButton>
            )
          }}
        />
        <BasicModal onRegister={modalRegister} style="width: 70%">
          <DiscretionTypeTable useSelection boundKeys={boundKeys.value} onUpdateCheckedRowKeysHandler={submitCheckedRowKeys} onCancelBind={() => closeModal()} />
        </BasicModal>
      </>
    )
  }
})
