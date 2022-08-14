<script lang="ts" setup>
  import { AddOutline, CloseCircleOutline } from '@vicons/ionicons5'
  import type { FormSchema } from '@/components/form/src/types/form-type'
  import { ComponentDataSourceTypeData } from '@/components/form/src/types/index'
  import {
    autoCompletePlacement,
    buttonTypes,
    colorModes,
    dateTypeOptions,
    checkStrategyOptions,
    produceOptions,
    validateTriggerOptions,
    uploadAcceptFormat,
    inputTypeOptions,
    fieldValueOptions,
    defaultOptions,
    validateRuleTypeOptions
  } from '@/views/setting/custom-form/options'

  const props = defineProps({
    widgetSelect: {
      type: Object as PropType<FormSchema>,
      required: true,
      default: () => {
        return {}
      }
    }
  })

  const emits = defineEmits(['update:widgetSelect'])

  // const context = {
  //   emit: defineEmits(['update:widgetSelect']),
  //   slots: useSlots(),
  //   attrs: useAttrs()
  // }

  const state = reactive({
    widgetData: {} as FormSchema
  })
  // const cloneItem = () => {
  //   // 克隆item 后处理 离开事件
  // }
  //   field: '', // 表单组件id
  // label: '日期选择器',
  // labelMessage: '',
  // labelMessageStyle: '',
  // defaultValue: null,
  // component: 'NDatePicker',
  // componentProps: {},
  // rules: [],
  // giProps: {},
  // isFull: true, // 是否全长
  // suffix: '' // 扩展插槽

  // 新增验证规则
  const addValidateRule = () => {
    let ruleItem = {
      type: 'string',
      required: true,
      whetherCustomValidate: false,
      message: '',
      trigger: ['blur'],
      customValidate: ''
      // validator: (_: FormItemRule, value: any) => {
      //   if (!value) {
      //     return new Error('请输入该项')
      //   }
      //   return true
      // }
    }
    ;(state.widgetData.rules as object[]).push(ruleItem)
  }

  // 移除验证规则
  const removeValidateRule = (index: any) => {
    ;(state.widgetData.rules as object[]).splice(index, 1)
  }

  const updateFieldValueType = () => {
    // 修改字段类型 如果是 数组 赋值 空数组
    if (state.widgetData.fieldValueType === 'arrayString' || state.widgetData.fieldValueType === 'arrayNumber') {
      state.widgetData.defaultValue = []
    } else if (state.widgetData.fieldValueType === 'number') {
      state.widgetData.defaultValue = 0
    } else if (state.widgetData.fieldValueType === 'string') {
      state.widgetData.defaultValue = ''
    }
  }

  watch(
    () => props.widgetSelect,
    (val) => {
      if (['NRadioGroup', 'NCheckboxGroup', 'NSelect'].includes(val.component!) && !val.componentDataSourceType) {
        val.componentProps['options'] = defaultOptions
      }
      state.widgetData = val
    },
    {
      immediate: true,
      deep: true
    }
  )

  watch(state.widgetData, () => {
    if (state.widgetData.useCheckboxForSelect) {
      state.widgetData.componentProps.checkable = true
      state.widgetData.componentProps.cascade = true
      state.widgetData.componentProps.multiple = true
    }
    emits('update:widgetSelect', state.widgetData)
  })
</script>
<template>
  <div class="widget-config">
    <n-form :model="state.widgetData" label-placement="left" label-width="105">
      <n-divider dashed>通用配置</n-divider>
      <n-form-item label="字段名">
        <n-input v-model:value="state.widgetData.field" />
      </n-form-item>
      <n-form-item label="标题">
        <n-input v-model:value="state.widgetData.label" />
      </n-form-item>
      <n-form-item label="标题提示">
        <n-input v-model:value="state.widgetData.labelMessage" />
      </n-form-item>
      <n-form-item label="标题提示样式">
        <n-input v-model:value="state.widgetData.labelMessageStyle" />
      </n-form-item>
      <n-form-item label="字段值类型">
        <n-select v-model:value="state.widgetData.fieldValueType" :options="fieldValueOptions" clearable @on-update:value="updateFieldValueType" />
      </n-form-item>
      <n-form-item label="默认值" v-if="state.widgetData.fieldValueType === 'string'">
        <n-input v-model:value="state.widgetData.defaultValue" />
      </n-form-item>
      <n-form-item label="默认值" v-if="state.widgetData.fieldValueType === 'number'">
        <n-input-number v-model:value="state.widgetData.defaultValue" />
      </n-form-item>
      <n-form-item label="是否全长">
        <n-switch v-model:value="state.widgetData.isFull" />
      </n-form-item>
      <n-form-item label="数据源类型">
        <n-select v-model:value="state.widgetData.componentDataSourceType" :options="ComponentDataSourceTypeData" clearable />
      </n-form-item>
      <n-form-item label="字典值" v-if="state.widgetData.componentDataSourceType === 'Dictionaries'">
        <n-input v-model:value="state.widgetData.componentDataSourceName" />
      </n-form-item>
      <n-form-item label="默认数据源" v-if="!state.widgetData.componentDataSourceType">
        <n-select v-model:value="state.widgetData.defaultComponentSource" :options="state.widgetData.componentProps['options']" />
      </n-form-item>
      <n-form-item label="栅格占据的列数">
        <n-input v-model:value="state.widgetData.giProps.span" />
      </n-form-item>
      <n-form-item label="左侧间隔格数">
        <n-input v-model:value="state.widgetData.giProps.offset" />
      </n-form-item>
      <n-form-item label="是否禁用">
        <n-switch v-model:value="state.widgetData.componentProps.disabled" />
      </n-form-item>
      <n-divider dashed>验证规则</n-divider>
      <!-- <n-card class="my-4" v-for="(item, index) in validateRules" :key="index"> -->
      <n-card class="my-4" v-for="(item, index) in state.widgetData.rules" :key="index">
        <!-- <template #header-extra>
            <n-icon size="large" color="red" @click="removeValidateRule(index)">
              <CloseCircleOutline />
            </n-icon>
        </template>-->
        <n-space justify="space-between">
          <n-form-item label="是否必填">
            <n-switch v-model:value="item['required']" />
          </n-form-item>
          <n-icon size="large" color="red" @click="removeValidateRule(index)">
            <CloseCircleOutline />
          </n-icon>
        </n-space>
        <n-form-item label="类型" v-if="item['type']">
          <n-select v-model:value="item['type']" :options="produceOptions(validateRuleTypeOptions)" clearable />
        </n-form-item>
        <n-form-item label="使用自定义验证">
          <n-switch v-model:value="item['whetherCustomValidate']" />
        </n-form-item>
        <n-form-item label="自定义验证" v-if="item['whetherCustomValidate']">
          <n-input v-model:value="item['customValidate']" />
        </n-form-item>
        <n-form-item label="验证信息" v-if="!item['whetherCustomValidate']">
          <n-input v-model:value="item['message']" />
        </n-form-item>
        <n-form-item label="触发方式">
          <n-select multiple v-model:value="item['trigger']" :options="produceOptions(validateTriggerOptions)" clearable />
        </n-form-item>
      </n-card>
      <n-button type="success" dashed size="small" @click="addValidateRule" class="my-4">
        <template #icon>
          <n-icon>
            <AddOutline />
          </n-icon>
        </template>
        新增规则
      </n-button>

      <n-divider dashed>自定义配置</n-divider>
      <!-- NInput -->
      <template v-if="state.widgetData.component === 'NInput'">
        <n-form-item label="输入框类型">
          <n-select v-model:value="state.widgetData.componentProps.type" :options="produceOptions(inputTypeOptions)" clearable />
        </n-form-item>
        <n-form-item label="最大输入长度">
          <n-input-number v-model:value="state.widgetData.componentProps.maxLength" clearable />
        </n-form-item>
        <n-form-item label="最小输入长度">
          <n-input-number v-model:value="state.widgetData.componentProps.minLength" clearable />
        </n-form-item>
      </template>
      <!-- NInputNumber -->
      <template v-else-if="state.widgetData.component === 'NInputNumber'">
        <n-form-item label="最大值">
          <n-input-number v-model:value="state.widgetData.componentProps.max" clearable />
        </n-form-item>
        <n-form-item label="最小值">
          <n-input-number v-model:value="state.widgetData.componentProps.min" clearable />
        </n-form-item>
        <n-form-item label="是否有按钮">
          <n-switch v-model:value="state.widgetData.componentProps.showButton" clearable />
        </n-form-item>
        <n-form-item label="每次改变步数">
          <n-input-number v-model:value="state.widgetData.componentProps.step" clearable />
        </n-form-item>
      </template>
      <template v-else-if="state.widgetData.component === 'NAutoComplete'">
        <n-form-item label="弹出位置">
          <n-select v-model:value="state.widgetData.componentProps.placement" :options="produceOptions(autoCompletePlacement)" clearable />
        </n-form-item>
      </template>
      <!-- NDynamicInput -->
      <template v-else-if="state.widgetData.component === 'NDynamicInput'">
        <n-form-item label="显示排序按钮">
          <n-switch v-model:value="state.widgetData.componentProps.showSortButton" clearable />
        </n-form-item>
        <n-form-item label="key值字段">
          <n-input v-model:value="state.widgetData.componentProps.keyField" />
        </n-form-item>
        <n-form-item label="最多有几项">
          <n-input-number v-model:value="state.widgetData.componentProps.max" clearable />
        </n-form-item>
        <n-form-item label="最少有几项">
          <n-input-number v-model:value="state.widgetData.componentProps.min" clearable />
        </n-form-item>
      </template>
      <!-- NDynamicTags -->
      <template v-else-if="state.widgetData.component === 'NDynamicTags'">
        <n-form-item label="标签类型">
          <n-select v-model:value="state.widgetData.componentProps.type" :options="produceOptions(buttonTypes)" clearable />
        </n-form-item>
        <n-form-item label="是否可关闭">
          <n-switch v-model:value="state.widgetData.componentProps.closable" clearable />
        </n-form-item>
        <n-form-item label="tag 的最大数量">
          <n-input-number v-model:value="state.widgetData.componentProps.max" clearable />
        </n-form-item>
      </template>
      <!-- NMention -->
      <template v-else-if="state.widgetData.component === 'NMention'">
        <n-form-item label="输入框类型">
          <n-select v-model:value="state.widgetData.componentProps.type" :options="produceOptions(inputTypeOptions).filter((item) => item.value !== 'password')" clearable />
        </n-form-item>
        <n-form-item label="提及的前缀">
          <n-input v-model:value="state.widgetData.componentProps.prefix" clearable />
        </n-form-item>
        <n-form-item label="切分提及的字符">
          <n-input v-model:value="state.widgetData.componentProps.separator" clearable />
        </n-form-item>
        <n-form-item label="弹出位置">
          <n-select v-model:value="state.widgetData.componentProps.placement" :options="produceOptions(autoCompletePlacement)" clearable />
        </n-form-item>
        <!-- <n-form-item label="选项列表"> -->
        <!-- 类型MentionOption[] -->
        <!-- <n-select v-model:value="widgetData.componentProps.options" :options="produceOptions(autoCompletePlacement)" clearable /> -->
        <!-- </n-form-item> -->
      </template>
      <!--NCheckbox  -->
      <template v-else-if="state.widgetData.component === 'NCheckbox'">
        <n-form-item label="标签值">
          <n-input v-model:value="state.widgetData.componentProps.label" clearable />
        </n-form-item>
      </template>
      <template v-else-if="state.widgetData.component === 'NColorPicker'">
        <n-form-item label="弹出位置">
          <n-select v-model:value="state.widgetData.componentProps.placement" :options="produceOptions(autoCompletePlacement)" clearable />
        </n-form-item>
        <n-form-item label="颜色格式">
          <n-select v-model:value="state.widgetData.componentProps.modes" multiple :options="produceOptions(colorModes)" clearable />
        </n-form-item>
        <n-form-item label="展示颜色预览块">
          <n-switch v-model:value="state.widgetData.componentProps.showPreview" clearable />
        </n-form-item>
        <n-form-item label="可调节alpha通道">
          <n-switch v-model:value="state.widgetData.componentProps.showAlpha" clearable />
        </n-form-item>
      </template>
      <template v-else-if="state.widgetData.component === 'NDatePicker'">
        <n-form-item label="类型">
          <n-select v-model:value="state.widgetData.componentProps.type" :options="produceOptions(dateTypeOptions)" clearable />
        </n-form-item>
        <n-form-item label="弹出位置">
          <n-select v-model:value="state.widgetData.componentProps.placement" :options="produceOptions(autoCompletePlacement)" clearable />
        </n-form-item>
      </template>
      <template v-else-if="state.widgetData.component === 'NTimePicker'">
        <n-form-item label="使用12小时制">
          <n-switch v-model:value="state.widgetData.componentProps.use12Hours" clearable />
        </n-form-item>
        <n-form-item label="弹出位置">
          <n-select v-model:value="state.widgetData.componentProps.placement" :options="produceOptions(autoCompletePlacement)" clearable />
        </n-form-item>
      </template>
      <template v-else-if="state.widgetData.component === 'NRate'">
        <n-form-item label="是否只读">
          <n-switch v-model:value="state.widgetData.componentProps.readonly" />
        </n-form-item>
        <n-form-item label="允许半颗">
          <n-switch v-model:value="state.widgetData.componentProps.allowHalf" />
        </n-form-item>
        <n-form-item label="颜色">
          <n-color-picker v-model:value="state.widgetData.componentProps.color" />
        </n-form-item>
      </template>
      <template v-else-if="state.widgetData.component === 'NSelect'">
        <n-form-item label="是否多选">
          <n-switch v-model:value="state.widgetData.componentProps.multiple" />
        </n-form-item>
        <n-form-item label="显示箭头">
          <n-switch v-model:value="state.widgetData.componentProps.showArrow" />
        </n-form-item>
        <n-form-item label="可过滤">
          <n-switch v-model:value="state.widgetData.componentProps.filterable" />
        </n-form-item>
      </template>
      <template v-else-if="state.widgetData.component === 'NSlider'">
        <n-form-item label="使用范围">
          <n-switch v-model:value="state.widgetData.componentProps.range" />
        </n-form-item>
        <n-form-item label="显示箭头">
          <n-switch v-model:value="state.widgetData.componentProps.showArrow" />
        </n-form-item>
        <n-form-item label="可过滤">
          <n-switch v-model:value="state.widgetData.componentProps.filterable" />
        </n-form-item>
      </template>
      <template v-else-if="state.widgetData.component === 'NTreeSelect'">
        <n-form-item label="是否多选">
          <n-switch v-model:value="state.widgetData.componentProps.multiple" />
        </n-form-item>
        <n-form-item label="勾选策略">
          <n-select v-model:value="state.widgetData.componentProps.checkStrategy" :options="produceOptions(checkStrategyOptions)" />
        </n-form-item>
        <n-form-item label="可过滤">
          <n-switch v-model:value="state.widgetData.componentProps.filterable" />
        </n-form-item>
        <n-form-item label="自定义字段">
          <n-space>
            <n-input placeholder="请输入key值" v-model:value="state.widgetData.componentProps.keyField" />
            <n-input placeholder="请输入label值" v-model:value="state.widgetData.componentProps.labelField" />
          </n-space>
        </n-form-item>
        <n-form-item label="使用checkbox">
          <n-switch v-model:value="state.widgetData.useCheckboxForSelect" />
        </n-form-item>
      </template>
      <template v-else-if="state.widgetData.component === 'NUpload'">
        <n-form-item label="文件类型">
          <n-select v-model:value="state.widgetData.componentProps.accept" :options="produceOptions(uploadAcceptFormat)" />
        </n-form-item>
        <n-form-item label="上传文件数量">
          <n-input-number v-model:value="state.widgetData.componentProps.max" />
        </n-form-item>
        <n-form-item label="显示文件列表">
          <n-switch v-model:value="state.widgetData.componentProps.showFileList" />
        </n-form-item>
        <n-form-item label="显示预览按钮">
          <n-switch v-model:value="state.widgetData.componentProps.showPreviewButton" />
        </n-form-item>
        <n-form-item label="是否支持多个">
          <n-switch v-model:value="state.widgetData.componentProps.multiple" />
        </n-form-item>
        <n-form-item label="显示取消按钮">
          <n-switch v-model:value="state.widgetData.componentProps.showCancelButton" />
        </n-form-item>
        <n-form-item label="显示下载按钮">
          <n-switch v-model:value="state.widgetData.componentProps.showDownloadButton" />
        </n-form-item>
        <n-form-item label="显示删除按钮">
          <n-switch v-model:value="state.widgetData.componentProps.showRemoveButton" />
        </n-form-item>
        <n-form-item label="显示重试按钮">
          <n-switch v-model:value="state.widgetData.componentProps.showRetryButton" />
        </n-form-item>
      </template>
    </n-form>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'WidgetConfig'
  }
</script>
