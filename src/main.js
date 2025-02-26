import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueMarkdownRender from 'vue-markdown-render';
import  vMarkdown  from 'vue-markdown';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.use(VueMarkdownRender)
app.use(vMarkdown)
app.use(ElementPlus)
app.mount('#app')
