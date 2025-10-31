import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import các file CSS toàn cục
import './assets/base.css'
import './assets/common.css' // Thêm dòng này

import './assets/icon.css' // Thêm dòng này
import '@fortawesome/fontawesome-free/css/all.css' // Thêm dòng này để dùng icon font-awesome

const app = createApp(App)

app.use(router)

app.mount('#app')
