<template>
  <div class="personnel-add-edit">
    <basic-form @register="register" @submit="handleSubmit">
      <template #PersonnelRole="{ model, disabled }">
        <personnel-role :org-id="model.orgId" v-model:value="model.role" :disabled="disabled" />
      </template>
      <template #customForm="{ model, disabled }">
        <custom-form-use :type="2" ref="customFomRef" :key="personnelId" :customFormValues="model.customFormValues" :disabled="disabled" />
      </template>
    </basic-form>
  </div>
</template>
<script lang="ts">
  import { schemas } from './add-edit-option'
  import { addEditPersonnel, queryPersonnelInfo } from '@/api/user/personnel'
  import { useForm } from '@/components/form/index'
  import schemaDataHandle from '@/hooks/custom-form-data-handle'
  import { IPersonnelInfo, IPositionParam } from '@/api/user/types'
  import PersonnelRole from './personnel-role.vue'
  import CustomFormUse from '@/components/custom-form-use/index.vue'
  export default defineComponent({
    name: 'PersonnelAddEdit',
    components: {
      PersonnelRole,
      CustomFormUse
    },
    props: {
      // 新增无人员id,编辑有
      personnelId: {
        type: String,
        default: ''
      },
      // 新增用户的orgId
      orgId: {
        type: String,
        default: ''
      },
      // true查看 编辑
      isCheck: {
        type: Boolean,
        default: false
      }
    },
    emits: ['closeModal', 'onSubmit'],
    setup(props, context) {
      const customFomRef = ref()
      const state = reactive({
        personnelInfo: {} as IPersonnelInfo, // 人员详情
        positionData: [] as IPositionParam[], // 职位
        formParams: {
          id: null,
          username: '', //用户名
          phone: '', //手机号码
          realName: '', //真实姓名
          sex: null, //性别
          position: null, //职位
          level: '', //职级
          nation: null, //民族
          idcard: '', //身份证
          major: '', //学历专业
          birthday: null, //出生年月
          topDegree: null, //最高学历
          email: '', //电子邮箱，比如 example@qq.com
          checkCode: '', //检查证号
          superviserCode: '', //执法监督证号
          enforceCode: '', //执法证号
          isMajorLaw: null, //是否法律专业
          isHaveLawQualification: null, //是否有法律资格
          regularNature: null, //编制性质
          positionNature: null, //岗位性质
          isLegalReview: null, //是否法制审核员
          political: null, //政治面貌
          role: [], // 角色id
          orgId: props.orgId
        }
      })
      const schemasForm = ref(schemas)
      schemaDataHandle(schemasForm.value)
      const useFormParams = ref({
        disabled: props.isCheck,
        gridProps: { cols: 2 },
        labelWidth: 120,
        layout: 'horizontal',
        showActionButtonGroup: false,
        buttonPosition: 'end',
        schemas: schemasForm.value
      })
      const [register, { setFieldsValue, validate, getFieldsValue }] = useForm(useFormParams.value)
      const closeModal = () => {
        context.emit('closeModal')
      }
      const resetInit = async () => {
        state.personnelInfo = await queryPersonnelInfo(props.personnelId)
        setFieldsValue(state.personnelInfo)
      }
      watch(
        () => props.personnelId,
        () => {
          if (props.personnelId) {
            // 编辑查询人员信息
            resetInit()
          } else {
            // 新增清空form 表单
            nextTick(() => {
              setFieldsValue(state.formParams)
            })
          }
        },
        {
          immediate: true
        }
      )
      watch(
        () => props.orgId,
        () => {
          state.formParams.orgId = props.orgId
          nextTick(() => {
            setFieldsValue(state.formParams)
          })
        },
        {
          immediate: true
        }
      ),
        watch(
          () => props.isCheck,
          () => {
            useFormParams.value.disabled = props.isCheck
          },
          {
            immediate: true
          }
        )
      const handleSubmit = async () => {
        try {
          await validate()
        } catch {
          // 异常失败返回false
          return false
        }
        const res = getFieldsValue()
        if (res.enforceFileList.length > 0) {
          res.enforceFile = res.enforceFileList.map((file) => file.fileId)[0]
        }
        res.role = res.role.filter((value: string) => {
          return !(value as string).includes('parent')
        })
        res.customFormValues = await customFomRef.value.saveCustomForm()
        try {
          // 既需要等待接口完成 又要保证报错后返回false 让modal取消加载
          const data = await addEditPersonnel(res)
          if (data) {
            if (!props.personnelId) {
              setFieldsValue(state.formParams)
            }
          }
          return data
        } catch {
          // 异常失败返回false
          return false
        }
      }
      return {
        closeModal,
        resetInit,
        register,
        handleSubmit,
        customFomRef
      }
    }
  })
</script>
