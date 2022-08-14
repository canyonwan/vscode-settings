import { queryAllCauseTags, queryCauseTagsWithIds } from '@/api/cause-manage/outdated/cause-manage'
import type { ICauseManageSearchType } from '@/api/cause-manage/types'
import { ILawItemType, ILawTagType } from '@/api/law/types'
import { useModal } from '@/components/modal'
import useDynamicComp from '@/hooks/useDynamicComp'
import { remove } from 'lodash-es'

interface IDisaplyState {
  selectedLaws: ILawItemType[]
  selectedCauseTags: ILawTagType[]
}

const { currentComp, onSwitchComp } = useDynamicComp()

const [modalRegister, { openModal, closeModal, setProps }] = useModal({
  title: '选择法',
  displayDirective: 'if'
})

export function useSearch(reloadTable: Function) {
  const searchParams = reactive<ICauseManageSearchType>({
    page: 1,
    size: 10,
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
    // searchParams.page = 1
    // searchParams.lawIdList = displayState.selectedLaws.map((item) => item)
    // searchParams.causeTagIdList = displayState.selectedCauseTags.map((item) => item)
    reloadTable()
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
    // const res = await queryLawDetailList(values)
    // searchParams.lawIdList = remove(res, (item) => item.id === item.id).map((ele) => ele.id!)
    closeModal()
  }

  // 删除单个案由法
  function onDeleteSingleLaw(item: Partial<ILawItemType>) {
    // displayState.selectedLaws.splice(displayState.selectedLaws.indexOf(item), 1)
    searchParams.lawIdList?.splice(searchParams.lawIdList.indexOf(item.id!), 1)
  }

  // 清除全部法
  function onClearLaws() {
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
    // causeTagTreeState.boundCauseTagsEntity = remove(res, (item) => item.id === item.id)
    closeModal()
  }

  // 删除单个案由标签
  function onDeleteSingleCauseTag(item: Partial<ILawTagType>) {
    searchParams.causeTagIdList!.splice(displayState.selectedLaws.indexOf(item.id!), 1)
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
