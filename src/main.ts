import { createApp } from 'vue'
import './assets/style.css'
import App from './App.vue'
import router from './router';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

const app = createApp(App);

app.use(router).use(PrimeVue, {
    theme: {
        preset: Aura
    }
}).mount('#app');
