import { createApp } from "vue";
// import "./assets/style.css";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { createPinia } from "pinia";
import axios from "axios";
import ToastService from "primevue/toastservice";

const app = createApp(App);
const pinia = createPinia();
app
  .use(router)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
    },
  })
  .use(pinia)
  .use(ToastService)
  .mount("#app");

app.config.globalProperties.axios = axios;
