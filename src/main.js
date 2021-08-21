import { createApp } from 'vue'
import App from './App.vue'
import 'bulma/css/bulma.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Inventory from '@/components/Inventory'
import '@/assets/css/styles.css'

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .component('inventory', Inventory)
  .mount('#app')
