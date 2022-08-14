<template>
  <div class="target-info">
    <basic-form :schemas="schemasSearch" @register="register" @submit="queryData" :frontEndIdentification="['a01_01']">
      <template #targetType>
        <label class="n-form-item-label">{{ rootTypeName }}类型</label>
        <n-select v-model:value="typeId" @update:value="updateType" :options="optionsList" v-if="typeDataChild && typeDataChild.length" />
      </template>
      <template #action="{ disabled }" v-if="!isSelection">
        <div class="w-full flex justify-end">
          <n-button type="primary" @click="handleAdd" :disabled="disabled">
            <template #icon>
              <n-icon>
                <AddOutline />
              </n-icon>
            </template>
            新增
          </n-button>
        </div>
      </template>
    </basic-form>
    <basic-table :columns="tableColumns" :action-column="actionColumn" :row-key="(row) => row.id" :request="resetInit" ref="tableRef" />
    <div class="mt-3 mb-3 p-2 bg-gray-100 bg-opacity-10" v-if="isSelection">
      <n-space>
        <span>已选:</span>
        <template v-if="checkedKeys && checkedKeys.length">
          <n-tag v-for="item in checkedKeys" closable :key="item.id" @close="handleDeleteSelect(item)">
            {{ item.name }}
          </n-tag>
        </template>
      </n-space>
    </div>
    <div class="flex justify-end items-end mt-2" v-if="isSelection">
      <n-button class="ml-2" @click="closeModel">取消</n-button>
      <n-button class="ml-2" @click="selectSubmit" type="primary">确定</n-button>
    </div>
    <basic-modal :showActionButtonGroup="true" :disabled="modelTitle === '详情'" @register="modalRegister" style="width: 70%" @on-ok="okSubmit" :title="typeName + modelTitle">
      <target-add-edit :target-detail="targetDetail" :formSchemas="formSchemas" :isDisabled="modelTitle === '详情'" ref="targetFomRef" />
    </basic-modal>
  </div>
</template>

<script lang="ts">
  import { FormSchema, useForm } from '@/components/form'
  import { TableAction } from '@/components/table'
  import { AddOutline } from '@vicons/ionicons5'
  import { useModal } from '@/components/modal'
  import { queryTargetData, deleteTarget, queryTargetDetail } from '@/api/target/target-manage'
  import { DataTableColumn, useDialog, useMessage } from 'naive-ui'
  import { ITargetInfo, ITargetType } from '@/api/target/types'
  import schemaDataHandle from '@/hooks/custom-form-data-handle'
  import TargetAddEdit from './target-add-edit.vue'
  export default defineComponent({
    components: {
      AddOutline,
      TargetAddEdit
    },
    props: {
      // 检查对象类型
      rootTypeId: {
        type: String,
        default: ''
      },
      rootTypeName: {
        type: String,
        default: ''
      },
      // 默认监察对象子类型
      childTypes: {
        type: Array as PropType<ITargetType[]>,
        default: () => []
      },
      // 查询条件
      searchSchemas: {
        type: Array as PropType<FormSchema[]>,
        default: () => []
      },
      // 新增编辑表单显示列表
      formSchemas: {
        type: Array as PropType<FormSchema[]>,
        default: () => []
      },
      // 是否为选择器
      isSelection: {
        type: Boolean,
        default: false
      },
      // 是否多选
      isMultiple: {
        type: Boolean,
        default: false
      },
      // 已选检查对象
      selectTargets: {
        type: Array as PropType<ITargetInfo[]>,
        default: () => {
          return []
        }
      }
    },
    emits: ['update:selectTargets', 'closeModel'],
    setup(props, context) {
      const message = useMessage()
      const checkedKeys = ref<ITargetInfo[]>([])
      const targetFomRef = ref()
      const state = reactive({
        typeDataChild: [] as ITargetType[],
        optionsList: [] as any,
        searchParam: {},
        typeId: '' as string | undefined, // 默认检查对象小类型
        typeName: '' as string | undefined, // 默认检查对象小类型名称
        tableColumns: [] as DataTableColumn[], // 自定义列table显示
        modelTitle: '新增', // 新增编辑弹窗标题
        targetDetail: {} as ITargetInfo, // 检查对象详情
        formParam: {
          id: null,
          rootTypeId: props.rootTypeId,
          typeId: undefined,
          name: '',
          legalPersonName: '', //法定代表人
          code: null, //统一社会信用代码/个人身份证号
          longitude: null,
          latitude: null,
          address: null,
          sex: null,
          positionName: null, //职务/职位 法人职务、公民职务
          telephone: null,
          environmentPersonName: null, // 环保负责人
          industryTypeId: null, // 行业类别
          workUnit: null,
          regionId: null, //地区ID
          customList: [], // 自定义项
          customColumnsData: [],
          state: null, // 企业状态
          fileList: null,
          fileInfoList: [],
          customFormValues: []
        }
      })
      const tableRef = ref()
      const schemasSearch = ref(props.searchSchemas)
      const schemasForm = ref(props.formSchemas)
      schemaDataHandle(schemasForm.value)

      const dialog = useDialog()
      const customFomRef = ref()
      const [modalRegister, { openModal, closeModal, setSubLoading }] = useModal({})
      watch(
        () => props.rootTypeId,
        () => {
          schemasSearch.value = props.searchSchemas
          schemasForm.value = props.formSchemas
          schemaDataHandle(schemasForm.value)
        }
      )
      watch(
        () => props.childTypes,
        () => {
          state.typeDataChild = props.childTypes
          if (props.childTypes && props.childTypes.length) {
            state.optionsList = props.childTypes.map((item) => {
              return {
                label: item.name,
                value: item.id
              }
            })
            state.typeId = props.childTypes[0].id
            state.typeName = props.childTypes[0].name
          } else {
            state.typeId = undefined
            state.typeName = undefined
          }
        },
        {
          immediate: true
        }
      )
      const [register] = useForm({
        gridProps: {
          cols: props.isSelection ? 3 : 4
        },
        labelWidth: 80,
        submitButtonText: '查询',
        showAdvancedButton: false,
        buttonPosition: 'end'
        // schemas: schemasSearch.value
      })

      const handleAdd = () => {
        state.modelTitle = '新增'
        state.targetDetail = { ...state.formParam, typeId: state.typeId ? state.typeId : 0 }
        openModal()
      }
      const okSubmit = async () => {
        const formRes = await targetFomRef.value.handleSubmit()
        if (formRes) {
          closeModal()
          reloadTable(state.modelTitle === '编辑' ? {} : { page: 1 })
        } else {
          setSubLoading(false)
        }
      }
      const actionColumn = ref({
        width: 150,
        title: '操作',
        key: 'action',
        fixed: 'right',
        align: 'center',
        render(record) {
          return h(TableAction, {
            style: 'text',
            actions: props.isSelection ? createCheckActions(record) : createActions(record)
          })
        }
      })
      const createActions = (record) => {
        return [
          {
            label: '查看',
            onClick: handleEdit.bind(null, record, true)
          },
          {
            frontEndIdentification: ['a01_01'],
            label: '编辑',
            onClick: handleEdit.bind(null, record, false)
          },
          {
            frontEndIdentification: ['a01_02'],
            type: 'error',
            label: '删除',
            onClick: handleDelete.bind(null, record)
          }
        ]
      }
      const createCheckActions = (record) => {
        return [
          {
            label: checkedKeys.value.length ? (checkedKeys.value.map((item) => item.id).includes(record.id) ? '已选择' : '选择') : '选择',
            onClick: handleChecked.bind(null, record)
          }
        ]
      }

      const handleEdit = async (record, check) => {
        state.modelTitle = check ? '详情' : '编辑'
        state.targetDetail = await queryTargetDetail(record.id)
        openModal()
      }
      const handleDelete = (info) => {
        dialog.error({
          title: '提示',
          content: '你确定要删除吗？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => {
            deleteTarget(info.id).then(() => {
              reloadTable()
            })
          },
          onNegativeClick: () => {}
        })
      }
      // 查询
      const queryData = (params) => {
        state.searchParam = {
          ...params
        }
        reloadTable({ page: 1 })
      }
      const reloadTable = (param = {}) => {
        // 刷新表单数据
        tableRef.value.reload(param)
      }
      const updateType = (value) => {
        state.typeId = value
        state.typeDataChild.map((item) => {
          if (item.id === state.typeId) {
            state.typeName = item.name
          }
        })
        reloadTable({ page: 1 })
      }
      const resetInit = async (res) => {
        res.typeId = state.typeId ? state.typeId : props.childTypes.length ? props.childTypes[0].id : undefined
        const params = {
          rootTypeId: props.rootTypeId,
          ...state.searchParam,
          ...res
        }
        const data = await queryTargetData(params)
        state.tableColumns = data.contents.customColumnList
        // if (props.isSelection) {
        //   state.tableColumns.unshift({
        //     type: 'selection',
        //     width: 100
        //   })
        // }
        const dataList = {
          contents: data.contents.dataList,
          page: data.page,
          size: data.size,
          total: data.total
        }
        return { ...dataList }
      }
      // 勾选
      const handleChecked = (info) => {
        if (props.isMultiple) {
          props.rootTypeId
          if (checkedKeys.value.length) {
            if (checkedKeys.value[0].rootTypeId === props.rootTypeId) {
              if (checkedKeys.value.map((item) => item.id).indexOf(info.id) === -1) {
                checkedKeys.value.push(info)
              }
            } else {
              message.warning('和已选检查对象类型不同，请选择同一类型的检查对象')
            }
          } else {
            checkedKeys.value.push(info)
          }
        } else {
          checkedKeys.value[0] = info
        }
      }
      const selectSubmit = () => {
        if (checkedKeys.value.length) {
          context.emit('update:selectTargets', checkedKeys.value)
        } else {
          message.warning('请选择检查对象')
        }
      }
      // 检查对象选择删除
      const handleDeleteSelect = (item) => {
        checkedKeys.value.splice(checkedKeys.value.indexOf(item), 1)
      }
      const closeModel = () => {
        context.emit('closeModel')
      }
      watch(
        () => props.selectTargets,
        () => {
          checkedKeys.value = props.selectTargets
        },
        { immediate: true }
      )
      return {
        checkedKeys,
        schemasSearch,
        tableRef,
        targetFomRef,
        ...toRefs(state),
        register,
        handleAdd,
        modalRegister,
        openModal,
        okSubmit,
        queryData,
        actionColumn,
        resetInit,
        updateType,
        customFomRef,
        handleChecked,
        selectSubmit,
        closeModel,
        handleDeleteSelect
      }
    }
  })
</script>
