<script setup lang="ts">
  import { queryAnnouncementDetail, sendAnnouncement } from '@/api/infrom'
  import type { IAnnouncementDetail } from '@/api/infrom/types'
  import { IFileItem } from '@/api/program/types'
  import { useModal } from '@/components/modal'
  import OrgSelect from '@/views/user/org-manage/components/org-select.vue'
  import { Add } from '@vicons/carbon'
  import { FormInst } from 'naive-ui'

  const props = defineProps({
    queryType: {
      type: Number
    },
    announcementId: {
      type: String,
      default: ''
    }
  })

  const emit = defineEmits(['handleSubmit'])

  const formRef = ref<FormInst | null>(null)
  let formValue = reactive<Partial<IAnnouncementDetail>>({})

  const rules = {
    title: {
      required: true,
      message: '请输入标题',
      trigger: 'blur'
    },
    content: {
      required: true,
      message: '请输入内容',
      trigger: 'blur'
    },
    receivingGroupTypeIds: {
      required: true,
      message: '请选择接收单位',
      trigger: 'blur'
    },
    contacts: {
      required: true,
      message: '请输入联系人',
      trigger: 'blur'
    },
    contactNumber: {
      required: true,
      message: '请输入联系电话',
      trigger: 'blur'
    }
  }

  const [modalRegister, { openModal, closeModal }] = useModal({
    title: '选择执法机构'
  })

  const state = reactive({
    selectedOrgKeys: [] as string[],
    fileInfo: [] as IFileItem[],
    fileIds: ''
  })

  async function onSubmit(type: number) {
    formRef.value?.validate(async (error) => {
      state.selectedOrgKeys.length > 0 && formRef.value?.restoreValidation()
      if (error && state.selectedOrgKeys.length > 0) {
        let params: IAnnouncementDetail = {
          title: formValue.title!,
          content: formValue.content!,
          contactNumber: formValue.contactNumber!,
          contacts: formValue.contacts!,
          whetherDraft: type,
          whetherPush: 1,
          whetherMessage: 0,
          receivingGroupTypeIds: state.selectedOrgKeys.join(','),
          fileIds: state.fileIds
        }
        delete params.fileChildren
        await sendAnnouncement(params)
        emit('handleSubmit')
      }
    })
  }

  async function getAnnouncementDetail() {
    const res = await queryAnnouncementDetail(props.announcementId)
    formValue = res
  }

  function chooseOrg() {
    openModal()
  }

  // 选择执法机构回调
  function onSelectOrgHandler(keys: string[]) {
    state.selectedOrgKeys = keys
  }

  function handleUploaded(list: IFileItem[]) {
    state.fileIds = list.map((item) => item.fileId).join(',')
  }

  watch(
    () => props.queryType,
    () => {
      if (props.queryType === 3 && props.announcementId) {
        getAnnouncementDetail()
      }
    }
  )
</script>

<template>
  <div class="announcement-detail">
    <n-form inline ref="formRef" label-placement="left" label-width="auto" :model="formValue" :rules="rules">
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi :span="24" label="标题" path="title">
          <n-input v-model:value="formValue.title" placeholder="请输入标题或内容" clearable />
        </n-form-item-gi>
        <n-form-item-gi :span="24" label="内容" path="content">
          <n-input type="textarea" v-model:value="formValue.content" placeholder="请输入标题或内容" clearable />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="联系人" path="contacts">
          <n-input v-model:value="formValue.contacts" placeholder="请输入联系人" clearable />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="联系电话" path="contactNumber">
          <n-input v-model:value="formValue.contactNumber" placeholder="请输入联系电话" clearable />
        </n-form-item-gi>
        <n-form-item-gi :span="24" label="接收单位" path="receivingGroupTypeIds">
          <n-button @click="chooseOrg" type="primary">选择机关 <n-icon :component="Add" size="20" /></n-button>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="文件">
          <basic-upload @update:value="handleUploaded" :value="state.fileInfo" />
        </n-form-item-gi>
      </n-grid>
    </n-form>
    <div class="text-right" v-show="props.queryType === 3">
      <n-button type="primary" ghost @click="onSubmit(0)" class="mr-5">保存为草稿</n-button>
      <n-button type="success" @click="onSubmit(1)">发送</n-button>
    </div>
    <BasicModal @register="modalRegister" style="width: 70%">
      <org-select @onCheck="onSelectOrgHandler" :bindKeys="state.selectedOrgKeys" @closeModal="() => closeModal()" />
    </BasicModal>
  </div>
</template>
