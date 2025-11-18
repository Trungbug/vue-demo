/**
 * Entry point của ứng dụng Vue
 * Created By NMDUC - 18/11/2025
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import các file CSS toàn cục
import './assets/css/base.css'
import './assets/css/common.css'
import '@fontsource/inter'
import './assets/css/icon.css'
import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
