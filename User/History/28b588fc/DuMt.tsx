import { deleteDiscretionGroup, queryDiscretionGroupsForPage } from '@/api/cause-manage/discretion'
import type { IDiscretionGroupType } from '@/api/cause-manage/types'
import { BasicModal, useModal } from '@/components/modal'
import { discretionGroupSwitchEventKey } from '@/views/cause-library/manage/fooKey'
import { NButton, NButtonGroup, NCheckbox, NCheckboxGroup, NInput, NInputGroup, NPagination, NSpace, useDialog, NEllipsis } from 'naive-ui'
import SaveGroup from './components/save-group'

export default defineComponent({
  name: 'DiscretionGroupList',
  props: {
    useCheckbox: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    checkedGroups: {
      type: Array as PropType<string[]>,
      default: () => []
    }
  },
  setup(props, { slots }) {
    // 初始化数据
    const state = reactive({
      groupList: [] as IDiscretionGroupType[], // 裁量分组列表
      total: 0,
      searchParams: {
        name: '',
        page: 1,
        size: 10
      },
      checkedGroups: [] as string[],
      currentGroupItem: {} as IDiscretionGroupType
    })

    const [modalRegister, { openModal, closeModal }] = useModal({
      title: '操作裁量分组',
      displayDirective: 'if'
    })

    const bus = useEventBus(discretionGroupSwitchEventKey)
    const dialog = useDialog()

    const getDiscretionGroups = async () => {
      const res = await queryDiscretionGroupsForPage(state.searchParams)
      state.groupList = res.contents
      state.searchParams.page = res.page
      state.searchParams.size = res.size
      state.total = res.total
    }

    const viewMenu = (id: string) => {
      bus.emit(['menu', id])
    }

    const switchPage = async (page: number) => {
      state.searchParams.page = page
      await getDiscretionGroups()
    }

    const switchPageSize = async (pageSize: number) => {
      state.searchParams.size = pageSize
      await getDiscretionGroups()
    }

    // 选中的组
    const onUpdateValue = (value: string[]) => {
      state.checkedGroups = value
    }

    // 新增裁量分组
    const addDiscretionGroup = () => {
      state.currentGroupItem.id = undefined
      openModal()
    }

    // 提交回调
    const submitHandler = async () => {
      closeModal()
      await getDiscretionGroups()
    }

    // 编辑当前分组
    const editGroup = async (e: MouseEvent, item: IDiscretionGroupType) => {
      e.stopPropagation()
      openModal()
      const { ...ele } = item
      state.currentGroupItem = { ...ele }
      await getDiscretionGroups()
    }

    // 删除当前分组
    const deleteGroup = (e: MouseEvent, id: string) => {
      e.stopPropagation()
      dialog.error({
        title: '提示',
        content: '你确定要删除吗？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
          await deleteDiscretionGroup(id)
          await getDiscretionGroups()
        }
      })
    }

    const onSearchGroup = async () => {
      state.searchParams.page = 1
      await getDiscretionGroups()
    }

    watch(
      () => props.useCheckbox,
      () => {
        state.checkedGroups = props.checkedGroups
      },
      { immediate: true }
    )

    onMounted(() => {
      getDiscretionGroups()
    })

    return () => (
      <>
        <NInputGroup class="mb-6">
          <NInput clearable placeholder="输入裁量分组名称以搜索" v-model:value={state.searchParams.name}></NInput>
          <NButton type="success" ghost onClick={onSearchGroup}>
            搜索
          </NButton>
        </NInputGroup>
        <NCheckboxGroup v-model:value={state.checkedGroups} onUpdateValue={onUpdateValue}>
          {state.groupList.map((item) => (
            <NSpace justify="space-between" class="hover:bg-red-700">
              <div onClick={() => viewMenu(item.id!)}>
                {props.useCheckbox && <NCheckbox value={item.id} />}
                <NEllipsis style="max-width: 500px" class={[props.useCheckbox && 'ml-2', 'cursor-pointer']} text type="primary" key={item.id} v-slots={{ default: () => item.name }}>
                  {item.name}
                </NEllipsis>
              </div>

              <NButtonGroup>
                <NButton class="mr-2" type="success" secondary size="tiny" onClick={(evt) => editGroup(evt, item)}>
                  编辑
                </NButton>
                <NButton type="error" size="tiny" secondary onClick={(evt) => deleteGroup(evt, item.id!)}>
                  删除
                </NButton>
              </NButtonGroup>
            </NSpace>
          ))}
        </NCheckboxGroup>

        <BasicModal onRegister={modalRegister} style="width: 40%">
          <SaveGroup currentGroupItem={state.currentGroupItem} onSubmitHandler={submitHandler} />
        </BasicModal>
        <NPagination
          class="mt-6"
          showSizePicker
          v-model:page={state.searchParams.page}
          v-model:page-size={state.searchParams.size}
          v-model:item-count={state.total}
          v-model:page-count={state.total}
          page-sizes={[10, 20, 30, 40]}
          onUpdate:page={switchPage}
          onUpdate:page-size={switchPageSize}
        />
        {slots.extraButton ? (
          props.useCheckbox && slots.extraButton(state.checkedGroups)
        ) : (
          <NButton class="mt-6" type="success" onClick={addDiscretionGroup}>
            新增裁量分组
          </NButton>
        )}
      </>
    )
  }
})
