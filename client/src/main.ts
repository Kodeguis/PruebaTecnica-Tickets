import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router.ts'
import { authStore } from './services/authStore.ts'

async function init() {
  // Comprobamos la sesión en segundo plano antes de renderizar la UI
  await authStore.checkSession();

  const app = createApp(App);
  app.use(router);
  app.mount('#app');
}

init();
