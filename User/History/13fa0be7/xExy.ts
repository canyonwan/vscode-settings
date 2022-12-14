// import { NButton } from 'naive-ui'
export interface ActionItem {
  onClick?: Fn
  label?: string
  color?: 'success' | 'error' | 'warning'
  icon?: string
  popConfirm?: PopConfirm
  disabled?: boolean
  divider?: boolean
  // 权限编码控制是否显示
  auth?: string
  // 业务控制是否显示
  ifShow?: boolean | ((action: ActionItem) => boolean)
}

export interface PopConfirm {
  title: string
  okText?: string
  cancelText?: string
  confirm: Fn
  cancel?: Fn
  icon?: string
}
