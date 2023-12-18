import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
//animate css
import 'animate.css'
//pinia
import { createPinia } from 'pinia'
import piniaPluginPersistedstated from 'pinia-plugin-persistedstate'
import '@/assets/css/style.css'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstated);

loadFonts()

createApp(App)
  .use(pinia)
  .use(router)
  .use(vuetify)
  .mount('#app')
