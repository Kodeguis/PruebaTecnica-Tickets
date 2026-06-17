<template>
  <div class="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 font-sans flex flex-col antialiased selection:bg-zinc-200 dark:selection:bg-zinc-850 transition-colors duration-250">
    <!-- Navbar Corporativo Minimalista -->
    <header class="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-900 transition-colors duration-250">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <!-- Logo Corporativo -->
        <router-link to="/" class="flex items-center space-x-1.5 sm:space-x-2 text-base sm:text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 hover:text-indigo-650 dark:hover:text-white transition-all duration-200">
          <Ticket class="h-5 w-5 text-indigo-500 shrink-0" />
          <span>TICKET<span class="text-indigo-600 dark:text-indigo-400 font-semibold">PASS</span></span>
        </router-link>

        <!-- Navegación y Sesión -->
        <nav class="flex items-center space-x-2 sm:space-x-4">
          <router-link to="/" class="text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors duration-150 px-1 py-1" active-class="text-zinc-900 dark:text-zinc-100 font-medium border-b border-zinc-900 dark:border-zinc-100 pb-0.5 pt-0.5">
            Inicio
          </router-link>

          <!-- Acceso Administrador (Solo si es admin) -->
          <router-link 
            v-if="authStore.isAuthenticated && authStore.user?.rol === 'admin'" 
            to="/admin" 
            class="text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors duration-150 flex items-center space-x-1.5 px-1 py-1"
            active-class="text-zinc-900 dark:text-zinc-100 font-medium border-b border-zinc-900 dark:border-zinc-100 pb-0.5 pt-0.5"
          >
            <Shield class="h-4 w-4 text-amber-500 shrink-0" />
            <span class="hidden sm:inline">Consola Admin</span>
          </router-link>

          <span class="hidden sm:block h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800"></span>

          <!-- Usuario Autenticado -->
          <div v-if="authStore.isAuthenticated" class="flex items-center space-x-2 sm:space-x-3">
            <router-link 
              to="/profile" 
              class="hidden md:flex items-center space-x-1.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors duration-150"
              active-class="text-zinc-900 dark:text-zinc-100 font-medium border-b border-zinc-900 dark:border-zinc-100 pb-0.5 pt-0.5"
            >
              <User class="h-4 w-4 text-zinc-400 dark:text-zinc-500 shrink-0" />
              <span>{{ authStore.user?.nombre }}</span>
            </router-link>
            <button 
              @click="handleLogout" 
              class="px-2.5 sm:px-3.5 py-1.5 rounded text-[11px] sm:text-xs font-semibold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all duration-150 flex items-center space-x-1 cursor-pointer shrink-0"
              title="Cerrar Sesión"
            >
              <LogOut class="h-3.5 w-3.5" />
              <span class="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>

          <!-- Invitado (No autenticado) -->
          <div v-else class="flex items-center space-x-1.5 sm:space-x-2">
            <router-link 
              to="/login" 
              class="text-[11px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors duration-150 px-2 sm:px-3 py-1.5 flex items-center space-x-1 shrink-0"
              title="Ingresar"
            >
              <LogIn class="h-3.5 w-3.5" />
              <span class="hidden sm:inline">Ingresar</span>
            </router-link>
            <router-link 
              to="/register" 
              class="px-2.5 sm:px-3.5 py-1.5 rounded text-[11px] sm:text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-150 shadow-sm shrink-0"
            >
              <span class="hidden sm:inline">Registrarse</span>
              <span class="sm:hidden">Registro</span>
            </router-link>
          </div>

          <span class="hidden sm:block h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800"></span>

          <!-- Botón de Alternar Tema (Al extremo derecho) -->
          <button 
            @click="toggleTheme" 
            class="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150 cursor-pointer shrink-0"
            title="Alternar Tema (Claro / Oscuro)"
          >
            <Sun v-if="theme === 'dark'" class="h-4.5 w-4.5" />
            <Moon v-else class="h-4.5 w-4.5" />
          </button>
        </nav>

      </div>
    </header>

    <!-- Contenido Principal -->
    <main class="flex-grow flex flex-col justify-start">
      <!-- Loader de Sesión Inicial -->
      <div v-if="authStore.checkingSession" class="flex-grow flex flex-col items-center justify-center space-y-4 py-24">
        <div class="h-6 w-6 border-2 border-zinc-400 dark:border-zinc-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-zinc-400 dark:text-zinc-500 text-xs font-medium tracking-wide uppercase">Iniciando conexión segura...</p>
      </div>

      <!-- Vistas del Router -->
      <router-view v-else v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer Corporativo -->
    <footer class="border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 py-8 text-center text-xs text-zinc-500 transition-colors duration-250">
      <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div>
          &copy; 2026 TicketPass Inc. Todos los derechos reservados.
        </div>
        <div class="flex space-x-6 text-zinc-400 dark:text-zinc-500">
          <span class="hover:text-zinc-900 dark:hover:text-zinc-400 transition-colors duration-150 cursor-pointer">Términos de Servicio</span>
          <span class="hover:text-zinc-900 dark:hover:text-zinc-400 transition-colors duration-150 cursor-pointer">Política de Privacidad</span>
          <span class="hover:text-zinc-900 dark:hover:text-zinc-400 transition-colors duration-150 cursor-pointer">Soporte Técnico</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { authStore } from "./services/authStore.ts";
import { useRouter } from "vue-router";
import { Ticket, Shield, LogOut, LogIn, User, Sun, Moon } from "@lucide/vue";

const router = useRouter();
const theme = ref("dark");

const toggleTheme = () => {
  if (theme.value === "dark") {
    theme.value = "light";
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    theme.value = "dark";
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
};

const handleLogout = async () => {
  await authStore.logout();
  router.push({ name: "home" });
};

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    theme.value = "light";
    document.documentElement.classList.remove("dark");
  } else {
    theme.value = "dark";
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
});
</script>

<style>
/* Animación de cambio de vistas limpia y sutil */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
