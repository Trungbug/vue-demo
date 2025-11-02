import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import các file CSS toàn cục
import './assets/css/base.css'
import './assets/css/common.css' // Thêm dòng này

import './assets/css/icon.css' // Thêm dòng này
import '@fortawesome/fontawesome-free/css/all.css' // Thêm dòng này để dùng icon font-awesome

const app = createApp(App)

app.use(router)

app.mount('#app')
