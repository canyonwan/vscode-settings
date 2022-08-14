import { NModal } from 'naive-ui'

export const basicProps = {
  ...NModal.props,
  // 确认按钮文字
  subBtuText: {
    type: String,
    default: '确认'
  },
  showIcon: {
    type: Boolean,
    default: false
  },
  // width: {
  //   type: Number,
  //   default: 446
  // },
  title: {
    type: String,
    default: ''
  },
  maskClosable: {
    type: Boolean,
    default: true
  },
  preset: {
    type: String,
    default: 'dialog'
  },
  displayDirective: {
    type: String,
    default: 'show'
  },
  showActionButtonGroup: {
    // 是否显示action 操作
    type: Boolean,
    default: false
  }
}
