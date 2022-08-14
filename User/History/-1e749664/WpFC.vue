<template>
  <div class="org-add-edit">
    <basic-form @close-modal="closeModal" @register="register" @submit="handleSubmit">
      <template #customForm="{ model, disabled }">
        <custom-form-use :type="1" :org-id="orgId" :key="orgId" ref="customFomRef" :customFormValues="model.customFormValues" :disabled="disabled" />
      </template>
    </basic-form>
  </div>
</template>
<script lang="ts">
  import { omit } from 'lodash-es'
  import { schemas } from './add-edit-option'
  import { addEditOrg, queryOrgInfo } from '@/api/user/org'
  import { useForm } from '@/components/form/index'
  import schemaDataHandle from '@/hooks/custom-form-data-handle'
  import { IOrgDetail, IOrgTreeInfo } from '@/api/user/types'
  import { useUserStore } from '@/store/modules/user'
  import CustomFormUse from '@/components/custom-form-use/index.vue'

  export default defineComponent({
    name: 'OrgAddEdit',
    components: { CustomFormUse },
    props: {
      // 机关id
      orgId: {
        type: String,
        default: ''
      },
      // 新增true,编辑false
      isAdd: {
        type: Boolean,
        default: true
      }
    },
    emits: ['closeModal', 'onSubmit'],
    setup(props, context) {
      const customFomRef = ref()
      const schemasForm = ref(schemas)
      const user = useUserStore()
      const state = reactive({
        treeList: {} as IOrgTreeInfo, // 树详情
        orgInfoInput: {} as IOrgDetail | undefined, //编辑详情
        formParams: {
          id: null,
          name: '',
          region: '',
          districtId: null,
          attachedType: null,
          representative: '',
          address: '',
          officePhone: null,
          code: null,
          legalChargePerson: '',
          legalChargePersonPhone: null,
          fax: null,
          confiscationPermitId: null,
          whetherseal: null,
          signature: '',
          codeprefix: '',
          zipcode: '',
          bankname: '',
          bankaccount: '',
          bankaccountcode: '',
          government: '',
          court: '',
          superorgname: '',
          organsystem: '',
          deptId: user.getUserInfo.deptId !== '0' ? user.getUserInfo.deptId : null,
          orgProperties: null
        }
      })
      const [register, { setFieldsValue }] = useForm({
        gridProps: { cols: 2 },
        labelWidth: 170,
        layout: 'horizontal',
        submitButtonText: '确定',
        buttonPosition: 'end',
        showCancelButton: true,
        schemas: schemasForm.value
      })
      const closeModal = () => {
        context.emit('closeModal')
      }

      const resetInit = () => {
        queryOrgInfo(props.orgId).then(
          async (data) => {
            state.treeList = omit(data, ['orgInfoOutput', 'orgRole'])
            state.orgInfoInput = data.orgInfoOutput
            const params = {
              ...state.orgInfoInput,
              attachedType: data.attachedType,
              districtId: data.districtId,
              deptId: data.deptId ? String(data.deptId) : '',
              orgProperties: state.orgInfoInput && state.orgInfoInput.orgProperties ? state.orgInfoInput.orgProperties.split(',') : null
            }
            setFieldsValue(params)
          },
          () => {
            setFieldsValue(state.formParams)
          }
        )
      }
      watch(
        [() => props.orgId, () => props.isAdd],
        () => {
          if (!props.isAdd) {
            resetInit()
          } else {
            if (state.treeList.id) {
              setFieldsValue(state.formParams)
            } else {
              nextTick(() => {
                setFieldsValue({ deptId: user.getUserInfo.deptId !== '0' ? user.getUserInfo.deptId : null })
              })
            }
          }
        },
        { immediate: true }
      )
      const handleSubmit = async (res) => {
        let info = {}
        res.orgProperties = res.orgProperties && res.orgProperties.length ? res.orgProperties.join(',') : null
        debugger
        if (props.isAdd) {
          const params = {
            parentId: props.orgId,
            orgGroup: 0, // 新增机关机构，默认非机关组
            orgName: res.name,
            attachedType: res.attachedType,
            districtId: res.districtId,
            deptId: res.deptId ? Number(res.deptId) : null,
            orgProperties: res.orgProperties
          }
          res.customFormValues = await customFomRef.value.saveCustomForm()
          info = { ...params, orgInfoInput: res }
        } else {
          state.treeList.orgName = res.name
          state.treeList.attachedType = res.attachedType
          state.treeList.districtId = res.districtId
          state.treeList.orgProperties = res.orgProperties
          state.treeList.deptId = res.deptId ? Number(res.deptId) : null
          // res.customFormValues = await customFomRef.value.saveCustomForm()
          Object.assign(state.orgInfoInput, res)
          info = { ...state.treeList, ...{ orgInfoInput: state.orgInfoInput } }
        }
        info['customFormValues'] = await customFomRef.value.saveCustomForm()
        addEditOrg(info).then((data) => {
          const dataList = omit(data, ['childrenList'])
          context.emit('onSubmit', dataList, props.isAdd)
          if (props.isAdd) {
            setFieldsValue(state.formParams)
          }
        })
      }
      schemaDataHandle(schemasForm.value)
      return {
        closeModal,
        resetInit,
        register,
        customFomRef,
        handleSubmit
      }
    }
  })
</script>
