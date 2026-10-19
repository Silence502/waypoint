import { createApp } from "vue";
import "./assets/main.css";
import PrimeVue from "primevue/config";
import { defaultTheme } from "./themes/default";
import router from "./router";
import { initDb } from "./services/db";

import App from "./App.vue";

const app = createApp(App);
app.use(router);
app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: defaultTheme,
    options: {
      darkModeSelector: ".gm-dark",
    },
  },
  license: import.meta.env.VITE_PRIMEUI_LICENSE_KEY,
});

await initDb();
app.mount("#app");
