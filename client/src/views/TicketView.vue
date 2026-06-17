<template>
  <div class="max-w-xl w-full mx-auto px-4 py-16 flex-grow flex flex-col justify-center">
    
    <!-- Spinner de Carga -->
    <div v-if="loading" class="flex flex-col items-center justify-center space-y-4 py-12">
      <div class="h-6 w-6 border-2 border-zinc-400 dark:border-zinc-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-zinc-500 dark:text-zinc-400 text-xs tracking-wider uppercase font-medium">Verificando autenticidad del pase...</p>
    </div>

    <!-- Error de Seguridad o No Encontrado -->
    <div v-else-if="errorMessage" class="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center space-y-6 shadow-md transition-colors duration-200">
      <div class="w-12 h-12 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mx-auto">
        <Lock class="h-5 w-5" />
      </div>
      <div class="space-y-2">
        <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Acceso No Autorizado</h3>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
          {{ errorMessage }}
        </p>
      </div>
      <router-link to="/" class="inline-flex items-center space-x-2 px-4 py-2 rounded text-xs font-medium bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 transition-colors duration-150">
        <ArrowLeft class="h-3.5 w-3.5" />
        <span>Volver al inicio</span>
      </router-link>
    </div>

    <!-- Boleto Físico Mockup Premium (Troquelado) -->
    <div v-else class="space-y-4">
      <div class="relative bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-md dark:shadow-black/20 overflow-hidden transition-all duration-300">
        
        <!-- Zona Superior: Cabecera e Información del Evento -->
        <div class="p-8 bg-zinc-50 dark:bg-zinc-900/80 relative">
          <!-- Círculos de Troquelado Lateral Izquierda y Derecha (usan el fondo de la página bg-zinc-50 para el efecto corte) -->
          <div class="absolute -bottom-4 -left-4 w-8 h-8 bg-zinc-50 dark:bg-zinc-955 rounded-full border border-zinc-200 dark:border-zinc-800 z-20 transition-colors duration-200"></div>
          <div class="absolute -bottom-4 -right-4 w-8 h-8 bg-zinc-50 dark:bg-zinc-955 rounded-full border border-zinc-200 dark:border-zinc-800 z-20 transition-colors duration-200"></div>

          <div class="flex justify-between items-start">
            <div class="space-y-1">
              <span class="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Pase de Acceso Oficial</span>
              <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{{ ticket.evento }}</h2>
              <p class="text-xs text-zinc-500 dark:text-zinc-400">Auditorio Principal — Zona A</p>
            </div>
            <Ticket class="h-6 w-6 text-zinc-455 dark:text-zinc-500" />
          </div>
        </div>

        <!-- Línea Separadora Troquelada (Puntos) -->
        <div class="relative h-[1px] border-t border-dashed border-zinc-200 dark:border-zinc-850 z-10"></div>

        <!-- Zona Inferior: Datos de Compra y Comprador -->
        <div class="p-8 space-y-6 bg-white dark:bg-zinc-900/20 relative transition-colors duration-200">
          <div class="grid grid-cols-2 gap-y-4 gap-x-6">
            
            <!-- Comprador -->
            <div class="space-y-0.5">
              <span class="text-[9px] font-semibold text-zinc-550 dark:text-zinc-500 uppercase tracking-wider">Titular</span>
              <p class="text-xs font-semibold text-zinc-850 dark:text-zinc-200">
                {{ ticket.comprador.nombre }} {{ ticket.comprador.apellido }}
              </p>
            </div>

            <!-- Identificación DNI -->
            <div class="space-y-0.5">
              <span class="text-[9px] font-semibold text-zinc-550 dark:text-zinc-500 uppercase tracking-wider">DNI</span>
              <p class="text-xs font-semibold text-zinc-850 dark:text-zinc-200 tracking-wider">
                {{ ticket.comprador.dni }}
              </p>
            </div>

            <!-- Fecha de Compra -->
            <div class="space-y-0.5">
              <span class="text-[9px] font-semibold text-zinc-550 dark:text-zinc-500 uppercase tracking-wider">Registro de Compra</span>
              <p class="text-xs text-zinc-600 dark:text-zinc-300">
                {{ formatDate(ticket.fechaCompra) }}
              </p>
            </div>

            <!-- Precio Pagado -->
            <div class="space-y-0.5">
              <span class="text-[9px] font-semibold text-zinc-550 dark:text-zinc-500 uppercase tracking-wider">Importe</span>
              <p class="text-xs font-semibold text-indigo-650 dark:text-indigo-400">
                ${{ ticket.precioPagado.toFixed(2) }} USD
              </p>
            </div>
          </div>

          <!-- Sección de Código de Barras Dinámico SVG -->
          <div class="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col items-center space-y-3">
            <div class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-4 rounded flex flex-col items-center justify-center transition-colors duration-200">
              <!-- Simulación de código de barras mediante líneas SVG -->
              <svg class="w-full h-12 text-zinc-900 dark:text-zinc-350" viewBox="0 0 100 20" preserveAspectRatio="none">
                <rect x="0" y="0" width="2" height="20" fill="currentColor" />
                <rect x="3" y="0" width="1" height="20" fill="currentColor" />
                <rect x="5" y="0" width="3" height="20" fill="currentColor" />
                <rect x="9" y="0" width="1" height="20" fill="currentColor" />
                <rect x="11" y="0" width="2" height="20" fill="currentColor" />
                <rect x="14" y="0" width="4" height="20" fill="currentColor" />
                <rect x="19" y="0" width="1" height="20" fill="currentColor" />
                <rect x="21" y="0" width="2" height="20" fill="currentColor" />
                <rect x="24" y="0" width="1" height="20" fill="currentColor" />
                <rect x="26" y="0" width="3" height="20" fill="currentColor" />
                <rect x="30" y="0" width="1" height="20" fill="currentColor" />
                <rect x="32" y="0" width="4" height="20" fill="currentColor" />
                <rect x="37" y="0" width="2" height="20" fill="currentColor" />
                <rect x="40" y="0" width="1" height="20" fill="currentColor" />
                <rect x="42" y="0" width="3" height="20" fill="currentColor" />
                <rect x="46" y="0" width="2" height="20" fill="currentColor" />
                <rect x="49" y="0" width="1" height="20" fill="currentColor" />
                <rect x="51" y="0" width="4" height="20" fill="currentColor" />
                <rect x="56" y="0" width="2" height="20" fill="currentColor" />
                <rect x="59" y="0" width="1" height="20" fill="currentColor" />
                <rect x="61" y="0" width="3" height="20" fill="currentColor" />
                <rect x="65" y="0" width="1" height="20" fill="currentColor" />
                <rect x="67" y="0" width="2" height="20" fill="currentColor" />
                <rect x="70" y="0" width="4" height="20" fill="currentColor" />
                <rect x="75" y="0" width="1" height="20" fill="currentColor" />
                <rect x="77" y="0" width="3" height="20" fill="currentColor" />
                <rect x="81" y="0" width="1" height="20" fill="currentColor" />
                <rect x="83" y="0" width="2" height="20" fill="currentColor" />
                <rect x="86" y="0" width="4" height="20" fill="currentColor" />
                <rect x="91" y="0" width="1" height="20" fill="currentColor" />
                <rect x="93" y="0" width="2" height="20" fill="currentColor" />
                <rect x="96" y="0" width="1" height="20" fill="currentColor" />
                <rect x="98" y="0" width="2" height="20" fill="currentColor" />
              </svg>
              <!-- Código único impreso -->
              <span class="text-zinc-500 dark:text-zinc-400 text-xs font-mono font-semibold tracking-widest mt-2 select-all">
                {{ ticket.codigoUnico }}
              </span>
            </div>
          </div>

        </div>
      </div>

      <!-- Acciones de Credencial -->
      <div class="flex items-center justify-between gap-4">
        <router-link to="/" class="inline-flex items-center space-x-1 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors duration-150">
          <ArrowLeft class="h-3.5 w-3.5" />
          <span>Volver al portal</span>
        </router-link>
        
        <div class="flex space-x-3">
          <button 
            @click="printTicket"
            class="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded text-xs font-semibold text-zinc-650 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:text-zinc-900 dark:hover:text-white transition-colors duration-150 flex items-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <Printer class="h-3.5 w-3.5" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { apiFetch } from "../services/api.ts";
import { Ticket, Lock, ArrowLeft, Printer } from "@lucide/vue";

const route = useRoute();

const loading = ref(true);
const errorMessage = ref("");

interface Buyer {
  nombre: string;
  apellido: string;
  dni: string;
}

interface TicketDetail {
  codigoUnico: string;
  evento: string;
  fechaCompra: string;
  precioPagado: number;
  comprador: Buyer;
}

const ticket = ref<TicketDetail>({
  codigoUnico: "",
  evento: "",
  fechaCompra: "",
  precioPagado: 0,
  comprador: {
    nombre: "",
    apellido: "",
    dni: "",
  },
});

const loadTicketDetails = async () => {
  const ticketId = route.params.ticketId;
  try {
    const data = await apiFetch<TicketDetail>(`/tickets/${ticketId}`);
    ticket.value = data;
  } catch (error: any) {
    console.error("Error al cargar ticket:", error);
    errorMessage.value = error.message || "No se pudo recuperar la información del boleto.";
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const printTicket = () => {
  window.print();
};

onMounted(() => {
  loadTicketDetails();
});
</script>
