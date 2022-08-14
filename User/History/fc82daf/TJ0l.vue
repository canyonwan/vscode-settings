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
  import type { FormInst, FormItemRule } from 'naive-ui'
  import { Add } from '@vicons/ionicons5'

  const tagFormInstRef = ref<FormInst | null>(null)
  const lawFormInstRef = ref<FormInst | null>(null)
  const deptFormInstRef = ref<FormInst | null>(null)

  const schemasForm = ref(schemas)
  schemaDataHandle(schemasForm.value)

  const props = defineProps<{ id: string }>()
  const emit = defineEmits(['onSelectOk', 'onCloseModal'])

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
  }

  interface ISearch {
    lawIdList: string[]
    deptList: string[]
    causeTagIdList: string[]
  }

  const displayState = reactive<IDisplyState>({
    boundCauseLaws: [], // 违法行为法
    boundDept: [], // 部门
    boundCauseTags: [] // 违法行为标签
  })

  const searchState = reactive<ISearch>({
    lawIdList: [],
    deptList: [],
    causeTagIdList: []
  })

  const { causeTagDatasources } = useSearch()

  // 打开违法行为法Modal
  function onSelectCauseLaw() {
    setProps({ title: '选择违法行为法' })
    openModal()
    onSwitchComp(0)
  }

  // 选择违法行为法的回调
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

  // 选择违法行为标签
  function onSelectCauseTags() {
    openModal()
    setProps({ title: '选择违法行为编号标签' })
    onSwitchComp(1)
  }

  // 选择违法行为标签回调
  async function selectCauseTagsHandler(keys: string[], rows: ILawTagType[]) {
    searchState.causeTagIdList = keys
    displayState.boundCauseTags = rows
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
      displayState.boundDept = res.deptList as IBaseType[]
      searchState.deptList = (res.deptList as IBaseType[]).map((item) => item.id!)
      searchState.causeTagIdList = res.causeTagList?.map((item) => item.id!)
      searchState.lawIdList = res.lawList?.map((item) => item.id!)
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
    await saveSubCause(params)
    emit('onSelectOk')
  }

  const tagRule: FormItemRule = {
    required: true,
    type: 'array',
    validator() {
      if (displayState.boundCauseTags.length === 0) {
        return new Error('请选择违法行为编号标签')
      }
      return true
    }
  }

  const lawRule: FormItemRule = {
    required: true,
    validator() {
      if (displayState.boundCauseLaws.length === 0) {
        return new Error('请选择违法行为法')
      }
      return true
    }
  }

  const deptRule: FormItemRule = {
    required: true,
    validator() {
      if (displayState.boundDept.length === 0) {
        return new Error('请选择部门类型')
      }
      return true
    }
  }
  watch(
    () => [displayState.boundCauseTags.length, displayState.boundCauseLaws.length, displayState.boundDept.length],
    () => {
      displayState.boundCauseTags.length > 0 && tagFormInstRef.value?.restoreValidation()
      displayState.boundCauseLaws.length > 0 && lawFormInstRef.value?.restoreValidation()
      displayState.boundDept.length > 0 && deptFormInstRef.value?.restoreValidation()
    }
  )

  onMounted(() => props.id && getCauseDetail())
</script>
<template>
  <div class="save-cause">
    <basic-form @register="register" @submit="onSubmit" @close-modal="() => $emit('onCloseModal')">
      <template #tag>
        <n-form-item ref="tagFormInstRef" label="违法行为标签" path="displayState.boundCauseTags" :rule="tagRule">
          <n-space vertical>
            <n-button ghost icon-placement="right" type="primary" @click="onSelectCauseTags">
              <template #icon>
                <n-icon :component="Add" />
              </template>
              选择违法行为标签
            </n-button>
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
        <n-form-item ref="lawFormInstRef" label="违法行为法" path="displayState.boundCauseLaws" :rule="lawRule">
          <n-space vertical>
            <n-button ghost type="primary" icon-placement="right" @click="onSelectCauseLaw">
              <template #icon>
                <n-icon :component="Add" />
              </template>
              选择违法行为法
            </n-button>
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
        <n-form-item ref="deptFormInstRef" label="部门类型" path="displayState.boundDept" :rule="deptRule">
          <n-space vertical>
            <n-button ghost icon-placement="right" type="primary" @click="onSelectDepartmentTypes">
              <template #icon>
                <n-icon :component="Add" />
              </template>
              选择部门类型
            </n-button>
            <n-space>
              <n-tag type="success" v-for="item in displayState.boundDept" :key="item.id">
                <n-ellipsis style="max-width: 240px">
                  {{ item.name }}
                </n-ellipsis>
              </n-tag>
            </n-space>
          </n-space>
        </n-form-item>
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
