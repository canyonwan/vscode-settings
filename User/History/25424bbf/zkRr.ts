import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { loadAllPlugins } from '@/plugins'
import './styles/antd.less'
import { parseTime } from '@/utils'
/** 将全局静态配置注入到应用中,可以通过 this.a读取,比 provide 和 inject 手动注入更方便  */
const app: ReturnType<typeof createApp> = createApp(App)
/** 加载所有 Plugins */
loadAllPlugins(app)
app.config.globalProperties.$parseTime = parseTime
app.use(router).mount('#app')
