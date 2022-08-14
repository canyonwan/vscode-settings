<template>
  <div class="add-matter">
    <a-spin :spinning="loading">
      <a-form ref="formRef" :model="formState" :rules="rules" :labelCol="{ flex: '120px' }" :wrapperCol="{ flex: '1' }">
        <a-form-item label="事项名称" name="name" required>
          <a-input v-model:value="formState.name" allowClear placeholder="请输入事项名称" />
        </a-form-item>
        <a-form-item label="事项类型">
          <a-select
            v-model:value="matterType"
            :rules="{
              required: true,
              message: '请选择事项类型',
              trigger: 'change',
              type: 'string'
            }"
            :disabled="disableMatterType"
            name="matterType"
            @change="changeMatterType"
            placeholder="请选择事项类型"
            allowClear
            style="width: 150px"
          >
            <a-select-option :value="1">请示事项</a-select-option>
            <a-select-option :value="2">通知事项</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="matterType === 2"
          label="办理期限"
          :rules="{
            required: true,
            message: '请选择办理期限',
            trigger: 'change',
            type: 'array'
          }"
          name="handleDateList"
        >
          <a-range-picker v-model:value="formState.handleDateList" allowClear />
        </a-form-item>
        <a-form-item
          label="设定催办时间"
          v-if="matterType === 2"
          :rules="{
            required: true,
            message: '请选择催办时间',
            trigger: 'change',
            type: 'object'
          }"
          name="remindDate"
        >
          <a-date-picker v-model:value="formState.remindDate" allowClear placeholder="请选择催办时间" />
        </a-form-item>
        <a-form-item label="发起单位">
          <div>{{ user.unitOrgName }}</div>
        </a-form-item>
        <a-form-item label="办理单位">
          <a-button type="primary" ghost @click="selectUnit" v-if="matterType === 2">
            <template #icon><PlusCircleOutlined /></template>
            选择办理单位
          </a-button>
          <div>
            <a-tag v-for="(unit, tagIndex) in formState.receiverInfoLists" :key="unit.unitOrgId" :closable="matterType === 2" @close="onDeleteUnitTag(tagIndex)">{{ unit.unitOrgName }}</a-tag>
          </div>
        </a-form-item>
        <a-form-item label="联系人" name="sendContacts" required>
          <a-input v-model:value="formState.sendContacts" allowClear placeholder="请输入联系人" />
        </a-form-item>
        <a-form-item label="联系电话" name="sendPhone" required>
          <a-input v-model:value="formState.sendPhone" allowClear placeholder="请输入联系电话" />
        </a-form-item>
        <a-form-item label="上传附件">
          <upload-file v-model:fileDatas="formState.sendFilesJson" />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea type="textarea" v-model:value="formState.sendNote" allowClear placeholder="请输入备注" />
        </a-form-item>
      </a-form>
      <div class="btn-footer">
        <a-button class="mg-left-top btn-min-w" shape="round" @click="onCancel"> 取消 </a-button>
        <a-button type="primary" class="mg-left-top btn-min-w" shape="round" @click="onSubmit"> 确认 </a-button>
      </div>
    </a-spin>
    <a-modal v-model:visible="selectUnitModal" :footer="null" title="选择办理单位" width="70%">
      <template #closeIcon><CloseCircleFilled /></template>
      <selector-unit-multiple @okSelect="okSelectUnit" :showType="0"></selector-unit-multiple>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, reactive, ref, toRefs, onMounted } from 'vue'
import { StateType, UserType } from '@/@types/index'
import { useStore } from 'vuex'
import { addMatter, AddMatterType, matterAddTypes, receiverInfoListsItemType } from '@/api/matter'
import { getOrgData, TreeItem } from '@/api/subject/org-manage'
import UploadFile from '@/components/upload-file'
import { DatePicker, Select, Input, Tag } from 'ant-design-vue'
import { PlusCircleOutlined, CloseCircleFilled } from '@ant-design/icons-vue'
import SelectorUnitMultiple from '@/components/selector-unit-multiple/index.vue'
import { TimeRangeValueType } from '@/api/subject/law-test'
import dayjs from 'dayjs'

export default defineComponent({
  name: 'AddMatter',
  components: {
    'a-range-picker': DatePicker.RangePicker,
    'a-select': Select,
    'a-textarea': Input.TextArea,
    'a-select-option': Select.Option,
    'a-date-picker': DatePicker,
    'a-tag': Tag,
    UploadFile,
    PlusCircleOutlined,
    CloseCircleFilled,
    SelectorUnitMultiple
  },
  emits: ['onSave', 'closeModal'],
  setup(props, ctx) {
    const internalInstance = getCurrentInstance()
    const store = useStore<StateType>()
    const user = store.getters.userInfo as UserType
    const formRef = ref()
    const rules = {
      name: [{ required: true, message: '请输入事项名称', trigger: 'change', type: 'string' }],
      sendContacts: [{ required: true, message: '请输入联系人', trigger: 'change', type: 'string' }],
      sendPhone: [{ required: true, message: '请输入联系电话', trigger: 'change', type: 'string' }]
    }
    const state = reactive({
      loading: false,
      topUnitList: [] as receiverInfoListsItemType[], // 上级请示单位信息
      matterType: 1,
      disableMatterType: false, // 禁止选择事项类型
      selectUnitModal: false // 选择单位的窗体
    })

    const formState = reactive({
      name: '', // 事项名称
      handleDateList: [] as any as TimeRangeValueType, // 办理期限 api中不用
      unitIds: [] as string[],
      beginDate: '', // 办理期限开始
      endDate: '', // 输期限结束
      sendContacts: '', // 联系人
      sendPhone: '', // 联系电话
      remindDate: '', // 催办时间
      receiverInfoLists: [] as receiverInfoListsItemType[], // 办理单位
      sendFilesJson: [], // 附件
      sendNote: '' // 备注
    } as AddMatterType)

    // 通过地区id获取单位列表
    const fetchTopUnitList = async () => {
      const topUnit = await getOrgData({ orgId4BelongToJusticeId: user.unitOrgId, filter: 0 })
      if (topUnit && topUnit.data.length > 0) {
        state.topUnitList = [
          {
            unitOrgId: topUnit.data[0].id,
            unitOrgName: topUnit.data[0].organizationName,
            sendType: '1'
          }
        ]
      }
      changeMatterType()
    }
    const onSubmit = () => {
      formRef.value.validate().then(() => {
        if (!(formState.receiverInfoLists && formState.receiverInfoLists.length > 0)) {
          internalInstance?.appContext.config.globalProperties.$message.warning('请选择办理单位')
          return
        }
        let params: AddMatterType = { ...formState }
        // 办理期限
        params.beginDate = dayjs(formState.handleDateList[0]).format('YYYY-MM-DD 00:00:00')
        params.endDate = dayjs(formState.handleDateList[1]).format('YYYY-MM-DD 23:59:59')
        // 催办时间
        params.remindDate = dayjs(params.remindDate).format('YYYY-MM-DD 00:00:00')
        state.loading = true
        addMatter(matterAddTypes[state.matterType - 1], params).then(
          () => {
            state.loading = false
            ctx.emit('onSave')
            internalInstance?.appContext.config.globalProperties.$message.success('新增事项成功')
          },
          () => {
            state.loading = false
          }
        )
      })
    }
    const changeMatterType = () => {
      if (state.matterType == 1) {
        // 请示
        formState.receiverInfoLists = state.topUnitList
      } else {
        formState.receiverInfoLists = []
      }
    }
    const initRole = () => {
      // 如果是司法局 && 还是县的
      // 就有2个事项
      if (user.isJustice && user.districtType === 3) {
        state.disableMatterType = false
        // state.matterType = ''
        return
      }
      if (user.isJustice) {
        state.matterType = 2 // 通知
        state.disableMatterType = true
      } else {
        state.disableMatterType = true
        state.matterType = 1 // 事项
      }
    }
    const onCancel = () => {
      ctx.emit('closeModal')
    }
    onMounted(() => {
      initRole()
      // formRef.value.resetFields()
      fetchTopUnitList()
    })
    const selectUnit = () => {
      state.selectUnitModal = true
    }
    const okSelectUnit = (list: TreeItem[]) => {
      // 选择单位后
      formState.receiverInfoLists = list.reduce((prev: any[], cur: any) => {
        const repeat = prev.filter((item: receiverInfoListsItemType) => {
          if (Object.is(cur.id, item.unitOrgId)) {
            return item
          }
        })
        if (repeat.length > 0) {
          // 有重复的
          return prev
        } else {
          return [...prev, { unitOrgName: cur.organizationName, sendType: 1, unitOrgId: cur.id }]
        }
      }, formState.receiverInfoLists)
      state.selectUnitModal = false
    }
    const onDeleteUnitTag = (index: number) => {
      formState.receiverInfoLists.splice(index, 1)
    }
    return { formRef, rules, ...toRefs(state), formState, user, onSubmit, onCancel, selectUnit, okSelectUnit, onDeleteUnitTag, changeMatterType }
  }
})
</script>

<style lang="less" scoped>
.add-matter {
}
</style>
