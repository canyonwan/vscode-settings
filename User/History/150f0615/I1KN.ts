import { defineConfig } from 'vite'
import { resolve } from 'path'
import uni from '@dcloudio/vite-plugin-uni'
import WindiCSS from 'vite-plugin-windicss'
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src'),
      },
    ],
  },
  plugins: [
    WindiCSS({
      scan: {
        dirs: ['.'], // 当前目录下所有文件
        fileExtensions: ['vue', 'js', 'ts'], // 同时启用扫描vue/js/ts
      },
    }),
    uni(),
    'import',
    {
      libraryName: '@nutui/nutui-taro',
      libraryDirectory: 'dist/packages/_es',
      style: (name, file) => name.toLowerCase().replace('_es/', '') + '/index.scss',
      camel2DashComponentName: false,
    },
    'nutui3-taro',
  ],
})
