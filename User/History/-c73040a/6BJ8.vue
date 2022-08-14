<template>
  <div class="sub-cause">
    <n-alert type="info" closable class="mb-10"> {{ data?.id ? `正在编辑【${editingCauseName} 】` : `正在为【${editingCauseName}】新增子案由` }} </n-alert>
    <n-form label-placement="left" label-width="100px" :style="{ width: '80%' }">
      <!-- 案由编号-->
      <n-form-item label="案由编号">
        <n-input v-model:value="data.identifier" placeholder="请输入案由编号" />
      </n-form-item>
      <!-- 案由名称 通用-->
      <n-form-item label="案由名称">
        <n-input type="textarea" v-model:value="data.name" placeholder="请输入案由名称" />
      </n-form-item>
      <!-- 检查对象类型 -->
      <n-form-item label="检查对象类型">
        <n-select v-model:value="selectedCheckingTargetType" multiple :options="checkingTargetTypeSources" placeholder="请选择检查对象类型" />
      </n-form-item>
      <!-- 案由主体描述-->
      <n-form-item label="违法主体标签">
        <n-dynamic-tags v-model:value="illegalSubjectOptions" />
      </n-form-item>
      <!--主案由详情-->
      <n-form-item label="案由法">
        <n-space vertical>
          <n-button type="primary" @click="onSelectCauseLaw">案由法</n-button>
          <n-space>
            <n-tag type="success" v-for="item in boundCauseLaws" :key="item.id"> {{ item.lawName }} </n-tag>
          </n-space>
        </n-space>
      </n-form-item>
      <!-- 机关层级 -->
      <n-form-item label="机关层级">
        <n-select multiple clearable v-model:value="orgPropertiesOptions" :options="orgPropertiesOptionsA" placeholder="请选择机关层级" />
      </n-form-item>
      <!--部门类型-->
      <n-form-item label="部门类型" class="mt-6">
        <n-space vertical>
          <n-button type="primary" @click="onSelectDepartmentTypes">选择部门类型</n-button>
          <n-space>
            <n-tag type="success" v-for="item in departmentTypes" :key="item.id"> {{ item.name }} </n-tag>
          </n-space>
        </n-space>
      </n-form-item>
      <!--TODO 适用提示-->
      <n-form-item label="适用提示" class="mt-6">
        <n-input type="textarea" v-model:value="data.tips" placeholder="请输入适用提示" />
      </n-form-item>
      <n-form-item label="&nbsp;">
        <n-button type="success" @click="onSaveSubCause">保存</n-button>
      </n-form-item>
    </n-form>
    <n-divider />
    <handling-way-list :id="data?.id" v-if="data?.id" />
    <basic-modal @register="modalRegister" style="width: 70%">
      <component
        :is="currentComp"
        :law-data="causeTagTreeData"
        :use-check="true"
        :bound-keys="boundDepartmentTypes"
        :cause-law-bound-keys="boundCauseLawKeys"
        :use-selection="true"
        :load-table-data="getDepartmentData"
        @selected-row-handler="onSelectDepartmentHandler"
        @on-close-modal="closeModal"
        @cancel-modal-handler="closeModal"
        @on-cancel-modal="closeModal"
        @submit-selection-handler="submitCauseLawHandler"
      />
    </basic-modal>
  </div>
</template>

<script lang="ts">
  import type { ICauseSubListItemType } from '@/api/cause-manage/types'
  import type { ILawItemType, ILawTagType } from '@/api/law/types'
  import type { IBaseType } from '@/api/setting/types'
  import { causeEventKey } from '@/views/cause-library/manage/fooKey'
  import useDynamicComp from '@/views/cause-library/manage/options'
  import { saveSubCause } from '@/api/cause-manage/cause-manage'
  import { queryDepartmentTypes } from '@/api/setting/base-types'
  import { queryLawDetailList } from '@/api/law/cause'
  import _ from 'lodash'
  import handlingWayList from './handling-way-list'
  import { useModal } from '@/components/modal'
  import { queryTargetTypes } from '@/api/target/target-type'
  import Add from '@vicons/ionicons5/Add'
  export default defineComponent({
    name: 'SubCause',
    components: { handlingWayList, Add },
    props: {
      causeDetail: {
        type: Object as PropType<ICauseSubListItemType>,
        default: () => {}
      }
    },
    setup(props) {
      const bus = useEventBus(causeEventKey)

      const state = reactive({
        checkingTargetTypeSources: [] as { label: string; value: string }[], // 检查对象类型源
        selectedCheckingTargetType: [] as string[], // 已选择的[检查对象类型]
        data: {} as ICauseSubListItemType, // 案由详情数据
        illegalSubjectOptions: [] as string[],
        editingCauseName: '' as string | undefined,
        causeTagTreeData: [] as ILawTagType[], // 案由标签树Data
        boundCauseLawKeys: [] as string[], // 选择的案由法keys
        boundCauseLaws: [] as Partial<ILawItemType>[], // 选择的案由法keys
        boundDepartmentTypes: [] as string[], // 选择的部门类型keys
        departmentTypes: [] as IBaseType[], // 部门类型数据
        orgPropertiesOptions: [] as string[] // 适用于部门类型配置
      })

      const model = ref({
        tags: [] as string[]
      })

      const subCauseIds = reactive({
        causeSubId: '',
        causeId: ''
      })

      const { currentComp, onSwitchComp } = useDynamicComp()

      const [modalRegister, { openModal, closeModal, setProps }] = useModal({
        title: '选择案由标签'
      })

      const orgPropertiesOptionsA = [
        {
          label: '县及以上',
          value: '1'
        },
        {
          label: '城市',
          value: '2'
        },
        {
          label: '设区市',
          value: '3'
        },
        {
          label: '省及以上',
          value: '4'
        },
        {
          label: '国家',
          value: '5'
        }
      ]

      // 检查对象类型
      const getCheckingTargetTypeData = async () => {
        let res = await queryTargetTypes()
        state.checkingTargetTypeSources = res.map((item) => {
          return {
            label: item.name!,
            value: item.id!
          }
        })
      }
      // 获取部门类型数据
      async function getDepartmentData() {
        let res = await queryDepartmentTypes()
        return res
      }

      // 打开案由法Modal
      function onSelectCauseLaw() {
        state.boundCauseLawKeys = state.boundCauseLaws?.map((item) => item.id!)
        setProps({ title: '选择案由法' })
        openModal()
        onSwitchComp(0)
      }

      // 选择案由法的回调
      async function submitCauseLawHandler(keys: string[]) {
        state.boundCauseLawKeys = keys
        const arr: Partial<ILawItemType>[] = []
        const lawNames = await queryLawDetailList(keys)
        arr.push(...lawNames)
        state.boundCauseLaws = _.remove(arr, (item) => item.id === item.id)
        closeModal()
      }

      // 打开部门类型Modal
      function onSelectDepartmentTypes() {
        setProps({ title: '选择部门类型' })
        openModal()
        onSwitchComp(2)
      }

      // 选择部门类型回调
      // async function onSelectDepartmentHandler(keys: string[]) {
      async function onSelectDepartmentHandler(rows: IBaseType[]) {
        state.boundDepartmentTypes = rows.map((item) => item.id!)
        state.departmentTypes = rows
        closeModal()
      }

      // 保存子案由
      async function onSaveSubCause() {
        let params: Partial<ICauseSubListItemType> = {
          // 新增字段
          identifier: state.data.identifier,
          illegalSubject: state.illegalSubjectOptions?.join(','),
          orgProperties: state.orgPropertiesOptions?.join(','),
          deptList: state.boundDepartmentTypes as string[],
          penaltyObjectType: state.selectedCheckingTargetType?.join(','),
          tips: state.data.tips,
          id: state.data.id,
          causeId: state.data?.causeId,
          name: state.data.name,
          caseType: state.boundCauseLawKeys,
          type: 1
        }
        if (!state.data?.id) {
          delete params.id
          state.data?.id && (params.causeId = state.data?.id)
        }
        await saveSubCause(params)
        bus.emit('submitHandler')
      }

      // 子案由id和子案由的案由id
      provide('subCauseIds', readonly(subCauseIds))

      watchEffect(() => {
        // 案由编号
        state.data.identifier = props.causeDetail?.identifier || ''
        // 案由主体标签
        // state.illegalSubjectOptions = props.causeDetail?.illegalSubject?.split(',') || []
        state.illegalSubjectOptions = props.causeDetail?.illegalSubject ? props.causeDetail?.illegalSubject?.split(',') : []
        // 检查对象类型
        state.selectedCheckingTargetType = props.causeDetail?.penaltyObjectType?.split(',') || []
        // 案由法
        state.boundCauseLawKeys = props.causeDetail.lawList?.map((item) => item.id!)
        // 部门类型
        state.departmentTypes = (props.causeDetail?.deptList as IBaseType[]) || []
        state.boundDepartmentTypes = props.causeDetail?.deptList?.map((item) => item.id)
        // 机关层级
        state.orgPropertiesOptions = props.causeDetail?.orgProperties?.split(',') || []
        // 适用提示
        state.data.tips = props.causeDetail?.tips || ''

        state.editingCauseName = props.causeDetail?.name
        state.data = { ...props.causeDetail, name: props.causeDetail?.id ? props.causeDetail?.name : '' }
        state.boundCauseLaws = props.causeDetail.lawList
        subCauseIds.causeSubId = state.data.id
        subCauseIds.causeId = state.data.causeId
      })

      onMounted(() => {
        getCheckingTargetTypeData()
        // state.illegalSubjectOptions = props.causeDetail?.illegalSubject?.split(',') || []
      })

      return {
        ...toRefs(state),
        orgPropertiesOptionsA,
        modalRegister,
        currentComp,
        closeModal,
        getDepartmentData,
        onSelectCauseLaw,
        onSelectDepartmentTypes,
        onSaveSubCause,
        model,
        submitCauseLawHandler,
        onSelectDepartmentHandler
      }
    }
  })
</script>
