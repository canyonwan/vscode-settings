import type { PropType } from 'vue'
import { NUpload } from 'naive-ui'
import type { IFileInfo } from '@/api/types'

export const basicProps = {
  ...NUpload.props,
  accept: {
    type: String,
    default: '.jpg,.png,.jpeg,.svg,.gif,.pdf'
  }, // fileTotalPlaybackTime 文件总播放时长（单位：秒），限制文件格式（.m4a;.mov;.mp3;.mp4;.wav 其他文件格式，返回null
  helpText: {
    type: String as PropType<string>,
    default: ''
  },
  maxSize: {
    type: Number as PropType<number>,
    default: 50
  },
  maxNumber: {
    type: Number as PropType<number>,
    default: Infinity
  },
  // 赋值默认图片显示
  value: {
    type: Array as PropType<IFileInfo[]>,
    default: () => []
  },
  width: {
    type: Number as PropType<number>,
    default: 150
  },
  height: {
    type: Number as PropType<number>,
    default: 150 //建议不小于这个尺寸 太小页面可能显示有异常
  }
  // defaultFiles: {
  //   type: Array as PropType<IFileInfo[]>,
  //   default: []
  // }
}
