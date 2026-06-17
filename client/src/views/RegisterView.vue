<template>
  <div class="max-w-md w-full mx-auto px-4 py-12 flex-grow flex flex-col justify-center">
    
    <!-- Contenedor del Formulario Profesional -->
    <div class="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 shadow-sm dark:shadow-md dark:shadow-black/20 relative overflow-hidden transition-all duration-300">
      
      <div class="relative z-10 space-y-6">
        <!-- Encabezado -->
        <div class="text-center space-y-1">
          <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Registro de Cuenta</h2>
          <p class="text-xs text-zinc-500 dark:text-zinc-400">Complete los datos solicitados para dar de alta su credencial</p>
        </div>

        <!-- Alerta de Error -->
        <div v-if="errorMessage" class="bg-red-55 text-red-750 border border-red-150 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 text-xs px-4 py-3 rounded flex items-center space-x-2.5">
          <AlertCircle class="h-4 w-4 shrink-0 text-red-500 dark:text-red-400" />
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Alerta de Éxito -->
        <div v-if="successMessage" class="bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 text-xs px-4 py-3 rounded flex items-center space-x-2.5">
          <CheckCircle2 class="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{{ successMessage }}</span>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleRegister" class="space-y-4">
          
          <!-- Fila Nombre y Apellido -->
          <div class="grid grid-cols-2 gap-4">
            <!-- Campo: Nombre -->
            <div class="space-y-1.5">
              <label for="nombre" class="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Nombre</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-650">
                  <User class="h-4 w-4" />
                </span>
                <input 
                  v-model="nombre" 
                  type="text" 
                  id="nombre" 
                  required 
                  placeholder="Juan"
                  class="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-805 rounded pl-9 pr-3.5 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-650 transition-colors duration-150"
                />
              </div>
            </div>
            <!-- Campo: Apellido -->
            <div class="space-y-1.5">
              <label for="apellido" class="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Apellido</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-650">
                  <User class="h-4 w-4" />
                </span>
                <input 
                  v-model="apellido" 
                  type="text" 
                  id="apellido" 
                  required 
                  placeholder="Pérez"
                  class="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-805 rounded pl-9 pr-3.5 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-650 transition-colors duration-150"
                />
              </div>
            </div>
          </div>

          <!-- Campo: DNI -->
          <div class="space-y-1.5">
            <label for="dni" class="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">DNI (Identificación)</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-650">
                <IdCard class="h-4 w-4" />
              </span>
              <input 
                v-model="dni" 
                type="text" 
                id="dni" 
                required 
                placeholder="Ej. 12345678-A"
                class="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-805 rounded pl-9 pr-3.5 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-650 transition-colors duration-150"
              />
            </div>
          </div>

          <!-- Campo: Email -->
          <div class="space-y-1.5">
            <label for="email" class="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Correo Electrónico</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-650">
                <Mail class="h-4 w-4" />
              </span>
              <input 
                v-model="email" 
                type="email" 
                id="email" 
                required 
                placeholder="nombre@empresa.com"
                class="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-805 rounded pl-9 pr-3.5 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-650 transition-colors duration-150"
              />
            </div>
          </div>

          <!-- Campo: Contraseña -->
          <div class="space-y-1.5">
            <label for="password" class="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Contraseña</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-650">
                <Lock class="h-4 w-4" />
              </span>
              <input 
                v-model="contrasena" 
                type="password" 
                id="password" 
                required 
                placeholder="Mínimo 6 caracteres"
                minlength="6"
                class="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-805 rounded pl-9 pr-3.5 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-650 transition-colors duration-150"
              />
            </div>
          </div>

          <!-- Botón de Envío -->
          <button 
            type="submit" 
            :disabled="submitting"
            class="w-full px-5 py-2.5 rounded text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-150 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm shadow-indigo-600/10 mt-2"
          >
            <span v-if="submitting" class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span v-else class="flex items-center space-x-1.5">
              <UserPlus class="h-4 w-4" />
              <span>Registrarse</span>
            </span>
          </button>
        </form>

        <!-- Redirección a Login -->
        <p class="text-center text-xs text-zinc-500 mt-4">
          ¿Ya tiene cuenta? 
          <router-link to="/login" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold hover:underline">
            Inicie sesión aquí
          </router-link>
        </p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { authStore } from "../services/authStore.ts";
import { User, IdCard, Mail, Lock, UserPlus, AlertCircle, CheckCircle2 } from "@lucide/vue";

const router = useRouter();

const nombre = ref("");
const apellido = ref("");
const dni = ref("");
const email = ref("");
const contrasena = ref("");

const submitting = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const handleRegister = async () => {
  submitting.value = true;
  errorMessage.value = "";
  successMessage.value = "";
  try {
    await authStore.register(
      dni.value,
      email.value,
      nombre.value,
      apellido.value,
      contrasena.value
    );

    successMessage.value = "¡Registro exitoso! Iniciando sesión automática...";

    setTimeout(async () => {
      try {
        await authStore.login(email.value, contrasena.value);
        router.push({ name: "home" });
      } catch (loginErr) {
        console.error("Fallo login automático:", loginErr);
        router.push({ name: "login" });
      }
    }, 1500);

  } catch (error: any) {
    console.error("Error en registro:", error);
    errorMessage.value = error.message || "No se pudo crear la cuenta. Verifica los datos.";
    submitting.value = false;
  }
};
</script>
