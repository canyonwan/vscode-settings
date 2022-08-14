import { queryAllCauseTags } from '@/api/cause-manage/outdated/cause-manage'
import type { ICauseManageSearchType } from '@/api/cause-manage/types'
import type { ILawItemType, ILawTagType } from '@/api/law/types'
import { useModal } from '@/components/modal'
import useDynamicComp from '@/hooks/useDynamicComp'

interface IDisaplyState {
  selectedLaws: ILawItemType[]
  selectedCauseTags: ILawTagType[]
}

const { currentComp, onSwitchComp } = useDynamicComp()

const [modalRegister, { openModal, closeModal, setProps }] = useModal({
  displayDirective: 'if'
})

export function useSearch(reloadTable?: Function) {
  const searchParams = reactive<ICauseManageSearchType>({
    name: '',
    causeTagIdList: [],
    lawIdList: []
  })

  const displayState = reactive<IDisaplyState>({
    selectedLaws: [],
    selectedCauseTags: []
  })

  const causeTagDatasources = ref<ILawTagType[]>([])

  // 搜索
  async function onSearch() {
    reloadTable && reloadTable()
  }

  function onCloseModal() {
    closeModal()
  }

  // 选择法
  function onSelectLaw() {
    setProps({ title: '选择法' })
    openModal()
    onSwitchComp(0)
  }

  // 选择法回调
  async function selectLawHandler(keys: string[], rows: ILawItemType[]) {
    searchParams.lawIdList = keys
    displayState.selectedLaws = rows
    closeModal()
  }

  // 删除单个案由法
  function onDeleteSingleLaw(item: ILawItemType) {
    displayState.selectedLaws.splice(displayState.selectedLaws.indexOf(item!), 1)
    searchParams.lawIdList?.splice(searchParams.lawIdList.indexOf(item.id!), 1)
  }

  // 清除全部法
  function onClearLaws() {
    searchParams.lawIdList!.length = 0
    displayState.selectedLaws.length = 0
  }

  // 选择案由标签
  function onSelectCauseTags() {
    openModal()
    setProps({ title: '选择案由标签' })
    onSwitchComp(1)
  }

  // 选择案由标签回调
  async function selectCauseTagsHandler(values: string[], rows: ILawTagType[]) {
    searchParams.causeTagIdList = values
    displayState.selectedCauseTags = rows
    closeModal()
  }

  // 删除单个案由标签
  function onDeleteSingleCauseTag(item: ILawTagType) {
    displayState.selectedCauseTags.splice(displayState.selectedCauseTags.indexOf(item), 1)
    searchParams.causeTagIdList!.splice(searchParams.causeTagIdList!.indexOf(item.id!), 1)
  }

  // 清除全部标签
  function onClearCauseTags() {
    displayState.selectedCauseTags.length = 0
  }

  // 获取案由标签
  async function queryCauseTags() {
    const res = await queryAllCauseTags()
    causeTagDatasources.value = processTreeData(res)
  }

  function processTreeData(data: ILawTagType[]) {
    if (data.length > 0) {
      for (const ele of data) {
        if (ele.list && ele.list.length > 0) {
          processTreeData(ele.list)
        } else {
          delete ele.list
        }
      }
    }
    return data
  }

  queryCauseTags()

  return {
    currentComp,
    searchParams,
    displayState,
    causeTagDatasources,
    onCloseModal,
    modalRegister,
    onSearch,
    onSelectLaw,
    selectLawHandler,
    onClearCauseTags,
    onSelectCauseTags,
    selectCauseTagsHandler,
    onDeleteSingleLaw,
    onClearLaws,
    onDeleteSingleCauseTag
  }
}
