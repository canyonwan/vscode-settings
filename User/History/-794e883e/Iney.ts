import { RouteRecordRaw } from 'vue-router'
import layout from '@/views/layout/index.vue'
/** 法律法规 */
const law: RouteRecordRaw = {
  path: '/public-platform',
  name: 'public-platform',
  component: layout,
  meta: {
    title: '法律法规汇编',
    icon: 'law',
    moduleCode: 'CompilationLawsAndRegulations'
  }
}
export default law
