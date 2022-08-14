import { createSSRApp } from 'vue'
// import 'virtual:windi.css'
// import 'virtual:windi-components.css'
// import 'virtual:windi-utilities.css'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app,
  }
}
