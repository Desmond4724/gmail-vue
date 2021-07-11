import {createApp} from 'vue'
import App from './App.vue'
import './assets/style.css'
const app = createApp(App)

app.config.globalProperties.console = console

app.mount('#app')
