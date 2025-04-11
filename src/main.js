import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App.vue';
import router from './router'
import 'ant-design-vue/dist/reset.css';
// import './mocks/Mocks'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { far } from '@fortawesome/pro-regular-svg-icons'
import { fas } from '@fortawesome/pro-solid-svg-icons'

library.add(far)
library.add(fas)

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.use(Antd).mount('#app');