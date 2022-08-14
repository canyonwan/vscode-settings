<script setup lang="ts">
  import { schemas } from './schemas'
  import { useSearch } from '../composables/useSearch'
  import { queryDepartmentTypes } from '@/api/setting/base-types'
  import { useForm } from '@/components/form'
  import { useModal } from '@/components/modal'
  import schemaDataHandle from '@/hooks/custom-form-data-handle'
  import useDynamicComp from './options'
  import { LawEnum } from '@/enums/law-enum'
  import { queryCauseDetail, saveSubCause } from '@/api/cause-manage/cause-manage'
  import type { ICauseSubListItemType, ISaveCause } from '@/api/cause-manage/types'
  import type { ILawItemType, ILawTagType } from '@/api/law/types'
  import type { IBaseType } from '@/api/setting/types'
  import { FormItemRule } from 'naive-ui'

  const schemasForm = ref(schemas)
  schemaDataHandle(schemasForm.value)

  const props = defineProps<{ id: string }>()
  const emit = defineEmits(['onSelectOk'])

  const [register, { setFieldsValue }] = useForm({
    gridProps: { cols: 1 },
    labelWidth: 100,
    layout: 'horizontal',
    inline: false,
    submitButtonText: '保存',
    showCancelButton: true,
    schemas: schemasForm.value
  })

  const [modalRegister, { openModal, closeModal, setProps }] = useModal({})

  const { currentComp, onSwitchComp } = useDynamicComp()

  interface IDisplyState {
    boundCauseLaws: ILawItemType[]
    boundDept: IBaseType[]
    boundCauseTags: ILawTagType[]
    causeTagRuleValue: string // 用于案由标签rule
  }

  interface ISearch {
    lawIdList: string[]
    deptList: string[]
    causeTagIdList: string[]
  }

  const displayState = reactive<IDisplyState>({
    boundCauseLaws: [], // 案由法
    boundDept: [], // 部门
    boundCauseTags: [], // 案由标签
    causeTagRuleValue: ''
  })

  const searchState = reactive<ISearch>({
    lawIdList: [],
    deptList: [],
    causeTagIdList: []
  })

  const { causeTagDatasources } = useSearch()

  // 打开案由法Modal
  function onSelectCauseLaw() {
    setProps({ title: '选择案由法' })
    openModal()
    onSwitchComp(0)
  }

  // 选择案由法的回调
  async function selectLawHandler(keys: string[], rows: ILawItemType[]) {
    searchState.lawIdList = keys
    displayState.boundCauseLaws = rows
    closeModal()
  }

  // 获取部门类型数据
  async function getDepartmentData() {
    return await queryDepartmentTypes()
  }

  // 打开部门类型Modal
  function onSelectDepartmentTypes() {
    setProps({ title: '选择部门类型' })
    openModal()
    onSwitchComp(2)
  }

  // 选中部门回调
  function selectDeptHandler(keys: string[], rows: IBaseType[]) {
    searchState.deptList = keys
    displayState.boundDept = rows
    closeModal()
  }

  // 选择案由标签
  function onSelectCauseTags() {
    openModal()
    setProps({ title: '选择案由标签' })
    onSwitchComp(1)
  }

  // 选择案由标签回调
  async function selectCauseTagsHandler(keys: string[], rows: ILawTagType[]) {
    searchState.causeTagIdList = keys
    displayState.boundCauseTags = rows
    displayState.causeTagRuleValue = keys + ''
    closeModal()
    const a: string[] = []
    for (const row of rows) {
      if (row.code) a.push(row.code)
    }
    nextTick(() => {
      setFieldsValue({ identifier: a.join('') })
    })
  }

  // get cause detail
  async function getCauseDetail() {
    const res = await queryCauseDetail(props.id)
    res.penaltyObjectType = res.penaltyObjectType ? (res.penaltyObjectType as string).split(',') : []
    res.orgProperties = res.orgProperties ? (res.orgProperties as string).split(',') : []
    res.illegalSubject = res.illegalSubject ? (res.illegalSubject as string).split(',') : []
    nextTick(() => {
      setFieldsValue(res)
      displayState.boundCauseLaws = res.lawList || []

      displayState.boundCauseTags = res.causeTagList || []
      displayState.causeTagRuleValue = res.causeTagList.join()

      displayState.boundDept = res.deptList as IBaseType[]
      searchState.deptList = (res.deptList as IBaseType[]).map((item) => item.id!)
      searchState.causeTagIdList = res.causeTagList?.map((item) => item.id!)
    })
  }

  async function onSubmit(values: ICauseSubListItemType) {
    const params: ISaveCause = {
      ...values,
      lawIdList: searchState.lawIdList,
      deptList: searchState.deptList,
      causeTagIdList: searchState.causeTagIdList,
      penaltyObjectType: (values.penaltyObjectType as string[]).join(','),
      orgProperties: (values.orgProperties as string[]).join(','),
      illegalSubject: values.illegalSubject ? (values.illegalSubject as string[]).join(',') : ''
    }
    delete values.lawList
    delete values.penaltyObjectTypeList
    await saveSubCause(params)
    emit('onSelectOk')
  }

  const tagRule: FormItemRule = {
    validator() {
      if (displayState.boundCauseTags.length === 0) {
        return new Error('请选择案由标签')
      }
      return true
    }
  }

  onMounted(() => {
    if (props.id) getCauseDetail()
  })
</script>
<template>
  <div class="save-cause">
    <basic-form @register="register" @submit="onSubmit">
      <template #tag>
        <n-form-item path="displayState.boundCauseTags" :rule="tagRule">
          <n-space vertical>
            <n-button ghost type="primary" @click="onSelectCauseTags">选择案由标签</n-button>
            <n-space>
              <n-tag type="success" v-for="item in displayState.boundCauseTags" :key="item.id">
                <n-ellipsis style="max-width: 240px">
                  {{ item.name }}
                </n-ellipsis>
              </n-tag>
            </n-space>
          </n-space>
        </n-form-item>
      </template>
      <template #causeLaw>
        <n-form-item path="displayState.boundCauseTags" :rule="tagRule">
          <n-space vertical>
            <n-button ghost type="primary" @click="onSelectCauseLaw">案由法</n-button>
            <n-space>
              <n-tag type="success" v-for="item in displayState.boundCauseLaws" :key="item.id">
                <n-ellipsis style="max-width: 240px">
                  {{ item.lawName }}
                </n-ellipsis>
              </n-tag>
            </n-space>
          </n-space>
        </n-form-item>
      </template>
      <template #dept>
        <n-space vertical>
          <n-button ghost type="primary" @click="onSelectDepartmentTypes">选择部门类型</n-button>
          <n-space>
            <n-tag type="success" v-for="item in displayState.boundDept" :key="item.id">
              <n-ellipsis style="max-width: 240px">
                {{ item.name }}
              </n-ellipsis>
            </n-tag>
          </n-space>
        </n-space>
      </template>
    </basic-form>
    <basic-modal @register="modalRegister" style="width: 70%">
      <component
        :is="currentComp"
        use-selection
        :cause-Law-bound-keys="searchState.lawIdList"
        @submit-selection-handler="selectLawHandler"
        @on-cancel-modal="closeModal"
        use-check
        use-radio
        :request-type="LawEnum.CAUSE"
        :law-data="causeTagDatasources"
        :checkedKeys="searchState.causeTagIdList"
        @on-select-ok="selectCauseTagsHandler"
        @on-close-modal="closeModal"
        :load-table-data="getDepartmentData"
        @selected-row-handler="selectDeptHandler"
        @cancel-modal-handler="closeModal"
      />
    </basic-modal>
  </div>
</template>
