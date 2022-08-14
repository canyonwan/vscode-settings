import { FormSchema } from '@/components/form'

export const announcementSchemas = [
  {
    field: 'title',
    component: 'NInput',
    label: '名称',
    componentProps: {
      placeholder: '请输入名称'
    },
    rules: [{ required: true, message: '请输入名称', trigger: ['blur'] }]
  },
  {
    defaultValue: null,
    giProps: {},
    field: 'content',
    component: 'NInput',
    label: '内容',
    componentProps: {
      placeholder: '请输入内容'
    },
    rules: [{ required: true, message: '请输入内容', trigger: ['blur'] }]
  },
  {
    defaultValue: null,
    giProps: {
      span: 2
    },
    field: 'receivingGroupTypeIds',
    label: '目标群体',
    componentProps: {
      placeholder: '请选择目标群体'
    },
    slot: 'receiveTargetSlot'
  },
  {
    defaultValue: 1,
    giProps: {},
    field: 'whetherPush',
    component: 'NRadioGroup',
    label: '发送站外消息',
    componentProps: {
      placeholder: '请选择',
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ]
    }
  },
  {
    defaultValue: 0,
    giProps: {},
    field: 'whetherMessage',
    component: 'NRadioGroup',
    label: '是否发送短信',
    componentProps: {
      placeholder: '请选择',
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ]
    }
  },
  {
    defaultValue: null,
    giProps: {
      span: 2
    },
    field: 'fileChildren',
    label: '文件',
    component: 'NUpload'
  }
] as FormSchema[]

export const announcementSearchSchemas = [
  {
    field: 'keyWord',
    component: 'NInput',
    label: '关键词',
    componentProps: {
      placeholder: '请输入标题或内容'
    }
  },
  {
    field: 'queryType',
    defaultValue: 2,
    component: 'NRadioGroup',
    label: '查询类型',
    componentProps: {
      options: [
        {
          label: '发件箱',
          value: 1
        },
        {
          label: '收件箱',
          value: 2
        },
        {
          label: '草稿箱',
          value: 3
        }
      ]
    }
  },
  {
    field: 'whetherRead',
    defaultValue: 0,
    component: 'NRadioGroup',
    label: '是否已读',
    componentProps: {
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ]
    }
  }
] as FormSchema[]
