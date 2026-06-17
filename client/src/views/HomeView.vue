<template>
  <div class="max-w-4xl mx-auto px-4 py-16 flex-grow flex flex-col justify-center animate-fade-in">
    
    <!-- Encabezado de Evento Corporativo -->
    <div class="text-center space-y-4 mb-12">
      <div class="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/25 px-3 py-1 rounded-full text-xs font-semibold text-indigo-750 dark:text-indigo-400">
        <Calendar class="h-3.5 w-3.5" />
        <span>18 - 20 de Noviembre, 2026</span>
      </div>
      <h1 class="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-2">
        CONGRESO TECNOLÓGICO ANTIGRAVITY
      </h1>
      <p class="text-zinc-600 dark:text-zinc-455 text-sm sm:text-base max-w-xl mx-auto font-normal">
        El encuentro líder en innovación de software empresarial, infraestructura de nube y seguridad digital. Adquiera su credencial de acceso oficial.
      </p>
    </div>

    <!-- Tarjeta Principal Minimalista y Profesional -->
    <div class="relative bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 md:p-10 shadow-sm dark:shadow-md dark:shadow-black/20 transition-all duration-300">
      
      <!-- Spinner de Carga -->
      <div v-if="loadingConfig" class="flex flex-col items-center justify-center space-y-4 py-12">
        <div class="h-6 w-6 border-2 border-zinc-400 dark:border-zinc-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-zinc-500 text-xs tracking-wider uppercase font-medium">Consultando disponibilidad de aforo...</p>
      </div>

      <!-- Contenido Principal -->
      <div v-else class="relative z-10 flex flex-col md:flex-row items-stretch justify-between gap-10">
        
        <!-- Detalles del Evento -->
        <div class="flex-grow space-y-6 w-full flex flex-col justify-between">
          <div class="space-y-3">
            <div class="flex items-center">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold"
                :class="config.ticketsDisponibles > 0 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-500/20'">
                <CheckCircle2 v-if="config.ticketsDisponibles > 0" class="h-3 w-3 mr-1" />
                <AlertTriangle v-else class="h-3 w-3 mr-1" />
                {{ config.ticketsDisponibles > 0 ? 'Registro Abierto' : 'Aforo Completo' }}
              </span>
            </div>
            <h2 class="text-xl font-bold text-zinc-800 dark:text-zinc-200">Pase de Acceso General (Full Access)</h2>
            
            <div class="space-y-1.5 pt-2">
              <div class="flex items-center text-zinc-600 dark:text-zinc-400 text-xs">
                <MapPin class="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500 mr-2" />
                <span>Centro de Convenciones Empresariales, Lima</span>
              </div>
              <div class="flex items-center text-zinc-600 dark:text-zinc-400 text-xs">
                <Users class="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500 mr-2" />
                <span>Auditorio Principal (Capacidad Limitada)</span>
              </div>
            </div>
          </div>

          <!-- Aforo / Barra de Progreso -->
          <div class="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
            <div class="flex justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <span>Capacidad Reservada</span>
              <span class="text-zinc-700 dark:text-zinc-300 font-semibold">{{ config.ticketsVendidos }} / {{ config.aforoTotal }} pases</span>
            </div>
            <div class="w-full bg-zinc-100 dark:bg-zinc-950 rounded h-2.5 p-[1px] border border-zinc-200 dark:border-zinc-900">
              <div 
                class="bg-indigo-600 dark:bg-indigo-650 h-full rounded transition-all duration-1000 ease-out"
                :style="{ width: `${(config.ticketsVendidos / config.aforoTotal) * 100}%` }"
              ></div>
            </div>
            <p class="text-[11px] text-zinc-400 dark:text-zinc-500">
              * El precio de los pases se incrementa dinámicamente según la demanda acumulada.
            </p>
          </div>
        </div>

        <!-- Panel de Compra / Cotización -->
        <div class="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-6 rounded-lg text-center flex flex-col items-center justify-center min-w-[280px] w-full md:w-auto shadow-sm">
          <span class="text-xs font-semibold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">Precio de Entrada</span>
          
          <div class="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mt-2 mb-6 flex items-baseline justify-center">
            <span class="text-lg text-indigo-600 dark:text-indigo-400 mr-1 font-semibold">$</span>
            <span class="tracking-tight">{{ config.precioActual.toFixed(2) }}</span>
            <span class="text-xs text-zinc-400 dark:text-zinc-500 ml-1 font-normal">USD</span>
          </div>

          <!-- Mensaje de Error / Alerta -->
          <p v-if="errorMessage" class="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-3 py-2.5 rounded mb-4 max-w-[240px]">
            {{ errorMessage }}
          </p>

          <!-- Botones de Acción -->
          <button 
            v-if="authStore.isAuthenticated"
            @click="handleBuyTicket"
            :disabled="config.ticketsDisponibles <= 0 || buyingTicket"
            class="w-full px-5 py-2.5 rounded text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-150 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm shadow-indigo-600/10"
          >
            <span v-if="buyingTicket" class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span v-else class="flex items-center space-x-2">
              <CreditCard class="h-4 w-4" />
              <span>Adquirir Pase</span>
            </span>
          </button>

          <router-link
            v-else
            to="/login"
            class="w-full px-5 py-2.5 rounded text-sm font-semibold bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all duration-150 flex items-center justify-center space-x-2"
          >
            <Lock class="h-4 w-4 text-zinc-500" />
            <span>Iniciar Sesión para Comprar</span>
          </router-link>

          <p class="text-[10px] text-zinc-400 dark:text-zinc-500 mt-4 font-medium">
            {{ config.ticketsDisponibles > 0 ? `Quedan exactamente ${config.ticketsDisponibles} vacantes` : 'Registro cerrado' }}
          </p>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { authStore } from "../services/authStore.ts";
import { apiFetch } from "../services/api.ts";
import { Calendar, MapPin, Users, Lock, CreditCard, CheckCircle2, AlertTriangle } from "@lucide/vue";

const router = useRouter();

const loadingConfig = ref(true);
const buyingTicket = ref(false);
const errorMessage = ref("");

interface EventConfig {
  aforoTotal: number;
  ticketsVendidos: number;
  ticketsDisponibles: number;
  precioBase: number;
  incremento: number;
  precioActual: number;
}

const config = ref<EventConfig>({
  aforoTotal: 0,
  ticketsVendidos: 0,
  ticketsDisponibles: 0,
  precioBase: 0,
  incremento: 0,
  precioActual: 0,
});

const fetchConfig = async () => {
  try {
    const data = await apiFetch<EventConfig>("/config");
    config.value = data;
  } catch (error: any) {
    console.error("Error al cargar la configuración:", error);
    errorMessage.value = error.message || "Error al conectar con la taquilla";
  } finally {
    loadingConfig.value = false;
  }
};

const handleBuyTicket = async () => {
  buyingTicket.value = true;
  errorMessage.value = "";
  try {
    const res = await apiFetch("/tickets/buy", { method: "POST" });
    router.push({ name: "ticket-detail", params: { ticketId: res.ticket._id } });
  } catch (error: any) {
    console.error("Error al comprar ticket:", error);
    errorMessage.value = error.message || "No se pudo completar la compra";
  } finally {
    buyingTicket.value = false;
  }
};

onMounted(() => {
  fetchConfig();
});
</script>
