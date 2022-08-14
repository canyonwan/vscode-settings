<template>
  <div class="initiate-training">
    <a-spin :spinning="loading">
      <a-form ref="formRef" :model="formState" :rules="rules" :labelCol="{ flex: '120px' }" :wrapperCol="{ flex: '1' }">
        <a-form-item label="培训名称" name="trainName" required>
          <a-input v-model:value="formState.trainName" allowClear placeholder="请输入培训名称" />
        </a-form-item>
        <a-form-item label="报名时间" name="registrationTimeList" required>
          <a-range-picker v-model:value="formState.registrationTimeList" format="YYYY/MM/DD" style="width: 220px" allowClear />
        </a-form-item>
        <a-form-item label="培训及考试时间" name="trainAndExamTimeList" required>
          <a-range-picker v-model:value="formState.trainAndExamTimeList" format="YYYY/MM/DD" style="width: 220px" allowClear />
        </a-form-item>
        <a-form-item label="参加单位" name="orgIds" required>
          <a-select v-model:value="formState.orgIds" mode="multiple" style="width: 100%" allowClear placeholder="请选择参加单位">
            <a-select-option v-for="(item, index) in unitList" :key="index" :value="item.id">{{ item.organizationName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="上传文件" name="file">
          <upload-file v-model:fileDatas="formState.fileList"></upload-file>
        </a-form-item>
        <a-form-item label="备注" name="remarks">
          <a-input v-model:value="formState.remarks" allowClear placeholder="请输入备注" />
        </a-form-item>
      </a-form>
      <div class="btn-footer">
        <a-button class="mg-left-top btn-min-w" shape="round" @click="onCancel"> 取消 </a-button>
        <a-button type="primary" class="mg-left-top btn-min-w" shape="round" @click="onSubmit"> 确认 </a-button>
      </div>
    </a-spin>
    <!--    新增消息-->
    <a-modal width="70%" v-model:visible="showPostMessageModal" title="新增消息" :footer="null">
      <template #closeIcon><CloseCircleFilled /></template>
      <message-add v-if="currentSelectUnits.length > 0" :orgList="currentSelectUnits" @okSave="onSavePostMessage" @closeModal="showPostMessageModal = false" />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { StateType, UserType } from '@/@types/index'
import { getUnitDataByDistrictId, UnitType } from '@/api/subject/org-manage'
import { fetchInitiateTraining, InitiateTrainingType, FileItem, TimeRangeValueType } from '@/api/subject/law-test'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { createVNode, defineComponent, getCurrentInstance, onMounted, reactive, ref, toRefs } from 'vue'
import { DatePicker, Select } from 'ant-design-vue'
import { CloseCircleFilled } from '@ant-design/icons-vue'
import { useStore } from 'vuex'
import UploadFile from '@/components/upload-file'
import MessageAdd from '@/views/message-center/components/message-add.vue'
import dayjs, { Dayjs } from 'dayjs'

export default defineComponent({
  name: 'InitiateTraining',
  components: {
    'a-range-picker': DatePicker.RangePicker,
    'a-select': Select,
    'a-select-option': Select.Option,
    UploadFile,
    MessageAdd,
    CloseCircleFilled
  },
  emits: ['closeModal', 'onSave'],
  setup(props, ctx) {
    const store = useStore<StateType>()
    const user = store.getters.userInfo as UserType
    const loading = ref<boolean>(false)
    const formRef = ref()
    const internalInstance = getCurrentInstance()
    const rules = {
      trainName: [{ required: true, message: '请输入培训名称', trigger: 'change', type: 'string' }],
      registrationTimeList: [{ required: true, message: '请选择报名时间', trigger: 'change', type: 'array' }],
      trainAndExamTimeList: [{ required: true, message: '请选择培训及考试时间', trigger: 'change', type: 'array' }],
      orgIds: [{ required: true, message: '请选择参加单位', trigger: 'change', type: 'array' }],
      file: [{ required: false, message: '请上传文件', trigger: 'change', type: 'string' }],
      remarks: [{ required: false, message: '请输入备注', trigger: 'change', type: 'string' }]
    }
    const state = reactive({
      unitList: [] as UnitType[], // 单位列表
      formState: {
        registrationTimeList: [dayjs(), dayjs()] as TimeRangeValueType, // 报名时间
        trainAndExamTimeList: [dayjs(), dayjs()] as TimeRangeValueType, // 培训及考试时间
        trainName: '', //培训名称
        signUpStartTime: 0, //报名开始时间
        signUpEndTime: 0, //报名结束时间
        trainStartTime: 0, //培训开始时间
        trainEndTime: 0, //培训结束时间
        fileList: [] as FileItem[], //文件路径
        orgIds: [], //机关IDs
        remarks: '' //备注
      } as InitiateTrainingType,
      showPostMessageModal: false,
      currentSelectUnits: [] as any[] // 当前选中的单位
    })
    // 通过地区id获取单位列表
    const fetchUnitList = () => {
      getUnitDataByDistrictId(user.districtId).then((result) => {
        state.unitList = result.data
      })
    }

    onMounted(() => fetchUnitList())

    function parseTime(params: any) {
      //
dayjs(state.formState.registrationTimeList[0]).format('YYYY-MM-DD'))
    }

    const onSubmit = () => {
      // console.log('%c [ registrationTimeList ]-105', 'font-size:13px; background:#0095FF; color:white;', dayjs(state.formState.registrationTimeList[0]).format('YYYY-MM-DD'))
      let params = { ...state.formState }
      if (state.formState.registrationTimeList.length > 0 || state.formState.trainAndExamTimeList.length > 0) {
        params.signUpStartTime = new Date(state.formState.registrationTimeList[0]).getTime()
        params.signUpEndTime = new Date(state.formState.registrationTimeList[1]).getTime()
        params.trainStartTime = new Date(state.formState.trainAndExamTimeList[0]).getTime()
        params.trainEndTime = new Date(state.formState.trainAndExamTimeList[1]).getTime()
      }
      formRef.value.validate().then(() => {
        internalInstance?.appContext.config.globalProperties.$modal.confirm({
          title: '操作提示',
          content: '您确认要发起培训吗？',
          icon: createVNode(ExclamationCircleOutlined),
          onOk() {
            loading.value = true
            fetchInitiateTraining(params).then(
              () => {
                loading.value = false
                ctx.emit('onSave')
                onPostMessage()
              },
              () => {
                loading.value = false
              }
            )
          }
        })
      })
    }

    const onPostMessage = () => {
      internalInstance?.appContext.config.globalProperties.$modal.confirm({
        title: '操作提示',
        content: '发起培训成功，您是否要发送消息通知所有单位？',
        icon: createVNode(ExclamationCircleOutlined),
        onOk() {
          state.currentSelectUnits = state.unitList
            .filter((item: any) => {
              if (state.formState.orgIds.includes(item.id)) {
                return item
              }
            })
            .map((ele) => {
              return {
                orgId: ele.id,
                orgName: ele.organizationName
              }
            })
          if (state.currentSelectUnits && state.currentSelectUnits.length > 0) {
            state.showPostMessageModal = true
          } else {
            internalInstance?.appContext.config.globalProperties.$message.warning('单位选择错误')
          }
        }
      })
    }

    const onSavePostMessage = () => {
      state.showPostMessageModal = false
    }

    const onCancel = () => {
      ctx.emit('closeModal')
    }
    return { loading, onCancel, onSubmit, ...toRefs(state), formRef, rules, onSavePostMessage }
  }
})
</script>
