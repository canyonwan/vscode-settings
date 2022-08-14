<template>
  <div class="approve-level-save">
    <basic-form class="mb-10" @register="register" @submit="handleSubmit" />
  </div>
</template>

<script lang="ts">
  import { schemas } from './detail-options'
  import { useForm } from '@/components/form'
  import schemaDataHandle from '@/hooks/custom-form-data-handle'
  import { saveApproveLevel, queryApproveLevelDetail } from '@/api/approval/approval-level'
  import { IApprovelLevel } from '@/api/approval/types'

  export default defineComponent({
    name: 'ApproveLevelSave',
    components: {},
    props: {
      infoId: {
        type: String,
        default: null
      }
    },
    emits: ['onSubmit'],
    setup(props, context) {
      const state = reactive({
        configInfo: {
          id: '',
          approvalRoles: '',
          approvalName: ''
          // sort: ''
        } as IApprovelLevel
      })
      const schemasForm = ref(schemas)
      schemaDataHandle(schemasForm.value)
      const [register, { setFieldsValue, resetFields }] = useForm({
        gridProps: {
          cols: 1
        },
        labelWidth: 100,
        submitButtonText: '提交',
        layout: 'horizontal',
        // showAdvancedButton: false,
        buttonPosition: 'end',
        schemas: schemasForm.value
      })

      const getDetail = async () => {
        if (props.infoId) {
          const data = await queryApproveLevelDetail(props.infoId)
          data.approvalRoles = data.approvalRoles.split(',')
          setFieldsValue(data)
        }
      }
      const handleSubmit = async (res) => {
        res.approvalRoles = res.approvalRoles.join(',')
        await saveApproveLevel(res)
        context.emit('onSubmit')
        if (!props.infoId) {
          resetFields()
        }
      }
      watch(
        () => props.infoId,
        () => {
          if (props.infoId) {
            getDetail()
          } else {
            nextTick(() => {
              setFieldsValue(state.configInfo)
            })
          }
        },
        {
          immediate: true
        }
      )
      return {
        register,
        ...toRefs(state),
        getDetail,
        handleSubmit
      }
    }
  })
</script>
