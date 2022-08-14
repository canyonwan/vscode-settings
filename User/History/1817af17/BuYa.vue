<template>
  <div class="param-config-save">
    <div class="mb-4">
      <label class="n-form-item-label">文书查询配制</label>
      <n-button class="ml-4" @click="openModal">选择</n-button>
      <n-tag class="ml-4" closable @close="handleConfigClose" v-if="configInfo.documentModelSearchConfigId"> {{ configInfo.documentModelSearchConfigName }}</n-tag>
    </div>
    <basic-form @register="register" @submit="handleSubmit" />
    <basic-modal @register="modalRegister" @on-ok="closeModal" style="width: 70%">
      <query-source :is-check="true" v-model:selectType="configInfo.documentModelSearchConfigId" @update:select-type="getConfigName" @close-modal="closeModal" />
    </basic-modal>
  </div>
</template>

<script lang="ts">
  import { SelectGroupOption, SelectOption } from 'naive-ui'
  import { schemas } from './detail-options'
  import { useForm } from '@/components/form'
  import { BasicModal, useModal } from '@/components/modal'
  import QuerySource from '../../query-source/index.vue'
  import schemaDataHandle from '@/hooks/custom-form-data-handle'
  import { saveParamConfig, queryParamConfigDetail } from '@/api/document/param-config'
  export default defineComponent({
    name: 'ParamConfigSave',
    components: {
      QuerySource,
      BasicModal
    },
    props: {
      configId: {
        type: String,
        default: ''
      }
    },
    emits: ['onSubmit', 'closeModal'],
    setup(props, context) {
      // const message = useMessage()
      const state = reactive({
        searchTypeData: [] as Array<SelectOption | SelectGroupOption>,
        configInfo: {
          id: null,
          chineseName: '', // 名称
          englishName: '', // 字段key名称
          wordModelKey: '', // 模板key
          defaultValue: '', // 默认值
          documentModelDataTypeId: null, // 文书数据类型 外键
          documentModelSearchConfigId: '', // 文书查询配制表ID
          documentModelSearchConfigName: '', // 文书查询配制表名称
          updateSourceDataSql: '',
          description: '', // 字段提示
          baseCauseAttId: null, // 违法行为属性类型
          groupWordModelKey: '' // 分组定位key
        }
      })
      const schemasForm = ref(schemas)
      schemaDataHandle(schemasForm.value)
      const [register, { setFieldsValue, resetFields }] = useForm({
        gridProps: {
          cols: 2
        },
        labelWidth: 110,
        submitButtonText: '提交',
        layout: 'horizontal',
        buttonPosition: 'end',
        schemas: schemasForm.value
      })
      const [modalRegister, { openModal, closeModal }] = useModal({
        title: '选择文书数据类型'
      })
      const getDetail = async (id) => {
        const data = await queryParamConfigDetail(id)
        state.configInfo.documentModelSearchConfigId = data.documentModelSearchConfigId
        state.configInfo.documentModelSearchConfigName = data.documentModelSearchConfigName
        setFieldsValue(data)
      }
      const handleSubmit = async (res) => {
        const params = { ...res, documentModelSearchConfigId: state.configInfo.documentModelSearchConfigId, documentModelSearchConfigName: state.configInfo.documentModelSearchConfigName }
        // if (!state.configInfo.documentModelSearchConfigId) {
        //   message.warning('请选择文书查询配制')
        //   return
        // }
        await saveParamConfig(params)
        context.emit('onSubmit')
        if (!props.configId) {
          resetFields()
          state.configInfo.documentModelSearchConfigId = ''
          state.configInfo.documentModelSearchConfigName = ''
          // console.log(res, 'res', state.configInfo)
        }
      }
      const getConfigName = (_id, name) => {
        state.configInfo.documentModelSearchConfigName = name
      }
      const handleConfigClose = () => {
        state.configInfo.documentModelSearchConfigId = ''
        state.configInfo.documentModelSearchConfigName = ''
      }
      watch(
        () => props.configId,
        () => {
          if (props.configId) {
            getDetail(props.configId)
          } else {
            state.configInfo.documentModelSearchConfigId = ''
            state.configInfo.documentModelSearchConfigName = ''
            nextTick(() => {
              setFieldsValue(state.configInfo)
            })
          }
        },
        { immediate: true }
      )
      return {
        register,
        modalRegister,
        ...toRefs(state),
        openModal,
        closeModal,
        handleSubmit,
        getConfigName,
        handleConfigClose
      }
    }
  })
</script>
