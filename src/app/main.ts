import { createApp } from 'vue'
import { router } from './router'
import { setupThemeProvider } from './providers/theme-provider'
import App from './App.vue'
import '@shared/styles/main.css'

const app = createApp(App)

setupThemeProvider(app)
app.use(router)
app.mount('#app')
