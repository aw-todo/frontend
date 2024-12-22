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
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";

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

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
);
