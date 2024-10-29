/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import VueApexCharts from "vue3-apexcharts";
import { createAuth0 } from '@auth0/auth0-vue';
import '@/assets/main.scss';
import App from './App.vue'
import { createApp } from 'vue'

const app = createApp(App)
app.use(createAuth0({
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: "https://apy-atlas-app.com/api",
  }
}));
app.use(VueApexCharts);
registerPlugins(app)


app.mount('#app')
