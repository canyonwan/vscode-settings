<script setup lang="ts">
  import { ICaseConnectInfo } from '@/api/time-line/types'
  import { queryShowEnforceCertDetail, saveShowEnforceCert, type IShowEnforceCertParmas } from '@/api/workflow/model-tool'
  import { useGetAddress } from './useMapPlugin'

  const props = defineProps({
    caseInfo: {
      type: Object as PropType<ICaseConnectInfo>,
      default: () => {}
    },
    id: String // 亮证记录id
  })

  const formRef = ref()
  const mapRef = ref()

  const emit = defineEmits(['submitHandler'])

  const form: IShowEnforceCertParmas = reactive({
    fileList: [],
    fileId: '',
    address: '',
    longitude: '',
    latitude: '',
    procedureId: '',
    toolId: '',
    timeLineId: '',
    toolGroup: ''
  })

  function onSubmit() {
    formRef.value.validate(async (errors) => {
      if (!errors) {
        form.fileId = form.fileList?.map((file) => file.fileId).join(',') || ''
        form.procedureId = props.caseInfo.procedureId
        form.toolId = props.caseInfo.toolId
        form.toolGroup = props.caseInfo.toolGroup
        form.timeLineId = props.id || props.caseInfo.timeLineId
        form.id = props.id || ''
        await saveShowEnforceCert(form)
        emit('submitHandler')
      }
    })
  }

  async function getShowEnforceCertDetail() {
    const res = await queryShowEnforceCertDetail(props.id!)
    form.address = res.address
    form.longitude = res.longitude
    form.latitude = res.latitude
    form.fileList = res.fileList
    form.procedureId = res.procedureId
    setTimeout(() => {
      useGetAddress([res.longitude, res.latitude], mapRef.value.aMap, mapRef.value.mapInstance)
    }, 500)
  }

  function chooseAddressHandler(address: string, lnglat: number[]) {
    form.address = address
    form.longitude = lnglat[0].toString()
    form.latitude = lnglat[1].toString()
  }

  watch(
    () => props.id,
    () => {
      props.id && getShowEnforceCertDetail()
    },
    { immediate: true }
  )

  const rules = {
    fileList: {
      required: true,
      message: '请上传',
      trigger: 'change',
      validator() {
        if (form.fileList?.length === 0) {
          return new Error('请上传啊')
        }
      }
    },
    address: {
      required: true,
      message: '请选择执法地址',
      trigger: 'change',
      validator() {
        if (!form.address) {
          return new Error('请选择执法地址')
        }
      }
    }
  }
</script>
<template>
  <div class="show-enforce-certificate">
    <n-form :model="form" ref="formRef" label-placement="left" :rules="rules">
      <n-form-item label="出示执法证记录" path="fileList">
        <BasicUpload v-model:value="form.fileList" />
      </n-form-item>

      <e-map ref="mapRef" @choose-address-handler="chooseAddressHandler" />

      <n-form-item label="检查地址" path="address">
        <n-input v-model:value="form.address" />
      </n-form-item>
      <n-form-item class="float-right">
        <n-button type="primary" @click="onSubmit">保存</n-button>
      </n-form-item>
    </n-form>
  </div>
</template>
