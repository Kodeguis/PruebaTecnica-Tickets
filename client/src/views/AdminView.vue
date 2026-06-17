<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow space-y-8 w-full animate-fade-in">
    
    <!-- Encabezado -->
    <div class="flex items-center space-x-3 pb-4 border-b border-zinc-200 dark:border-zinc-900 transition-colors duration-250">
      <Shield class="h-8 w-8 text-indigo-500" />
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Consola de Administración</h1>
        <p class="text-xs text-zinc-500 dark:text-zinc-400">Gestión de aforo, control de tarifas, auditoría de ventas y registro de usuarios.</p>
      </div>
    </div>

    <!-- Mensajes Globales -->
    <div v-if="successMsg" class="bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 text-xs px-4 py-3 rounded flex items-center space-x-2">
      <CheckCircle2 class="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
      <span>{{ successMsg }}</span>
    </div>
    <div v-if="errorMsg" class="bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 text-xs px-4 py-3 rounded flex items-center space-x-2">
      <AlertCircle class="h-4 w-4 shrink-0 text-red-500 dark:text-red-400" />
      <span>{{ errorMsg }}</span>
    </div>

    <!-- Sección 1: Estadísticas (KPIs) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Recaudación Total -->
      <div class="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex items-center justify-between transition-colors duration-200">
        <div class="space-y-1">
          <p class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Recaudación Total</p>
          <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${{ stats.gananciasTotales.toFixed(2) }}</p>
          <p class="text-[10px] text-zinc-400 dark:text-zinc-500">Monto consolidado en centavos</p>
        </div>
        <Coins class="h-8 w-8 text-zinc-400 dark:text-zinc-700" />
      </div>

      <!-- Entradas Vendidas -->
      <div class="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex items-center justify-between transition-colors duration-200">
        <div class="space-y-1">
          <p class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Pases Emitidos</p>
          <p class="text-2xl font-bold text-indigo-650 dark:text-indigo-400">{{ stats.ticketsVendidos }} unidades</p>
          <p class="text-[10px] text-zinc-400 dark:text-zinc-500">Credenciales generadas con éxito</p>
        </div>
        <Ticket class="h-8 w-8 text-zinc-400 dark:text-zinc-700" />
      </div>

      <!-- Aforo Configurado -->
      <div class="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex items-center justify-between transition-colors duration-200">
        <div class="space-y-1">
          <p class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Capacidad Máxima</p>
          <p class="text-2xl font-bold text-zinc-800 dark:text-zinc-300">{{ config.aforoTotal }} accesos</p>
          <p class="text-[10px] text-zinc-400 dark:text-zinc-500">Límite establecido del evento</p>
        </div>
        <Users class="h-8 w-8 text-zinc-400 dark:text-zinc-700" />
      </div>
    </div>

    <!-- Sección 2: Ajustes de Evento & Búsqueda -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Panel de Ajustes del Evento -->
      <div class="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm lg:col-span-1 space-y-4 transition-colors duration-200">
        <div class="flex items-center space-x-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <Settings class="h-4.5 w-4.5 text-zinc-400 dark:text-zinc-500" />
          <h3 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Parámetros del Evento</h3>
        </div>
        
        <form @submit.prevent="handleUpdateConfig" class="space-y-4">
          <!-- Campo: Aforo Total -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Capacidad de Aforo</label>
            <input 
              v-model="editConfig.aforoTotal" 
              type="number" 
              required
              class="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded px-3 py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-650 transition-colors"
            />
          </div>

          <!-- Campo: Precio Base -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Precio Base (USD)</label>
            <input 
              v-model="editConfig.precioBase" 
              type="number" 
              step="0.01" 
              required
              class="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded px-3 py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-650 transition-colors"
            />
          </div>

          <!-- Campo: Incremento -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Tasa de Incremento (USD)</label>
            <input 
              v-model="editConfig.incremento" 
              type="number" 
              step="0.01" 
              required
              class="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded px-3 py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-650 transition-colors"
            />
          </div>

          <button 
            type="submit" 
            :disabled="updatingConfig"
            class="w-full px-4 py-2 rounded text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-150 shadow-sm flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer"
          >
            <span v-if="updatingConfig" class="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span v-else>Guardar Parámetros</span>
          </button>
        </form>
      </div>

      <!-- Panel de Búsqueda Rápida de Usuarios -->
      <div class="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm lg:col-span-2 flex flex-col justify-between space-y-4 transition-colors duration-200">
        <div class="space-y-4">
          <div class="flex items-center space-x-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <Search class="h-4.5 w-4.5 text-zinc-400 dark:text-zinc-500" />
            <h3 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Directorio de Registrados</h3>
          </div>

          <!-- Formulario de Búsqueda -->
          <div class="flex gap-2">
            <input 
              v-model="userQuery" 
              @keyup.enter="triggerUserSearch"
              type="text" 
              placeholder="Filtrar por nombre, apellido o DNI..."
              class="flex-grow bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded px-4 py-2 text-sm text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-650 transition-colors"
            />
            <button 
              @click="triggerUserSearch"
              class="px-4 py-2 rounded text-xs font-semibold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
            >
              Buscar
            </button>
          </div>

          <!-- Listado de Usuarios Encontrados -->
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 uppercase tracking-wider font-semibold">
                  <th class="py-2.5">Titular</th>
                  <th class="py-2.5">DNI</th>
                  <th class="py-2.5">Email</th>
                  <th class="py-2.5">Rol</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="usersList.length === 0">
                  <td colspan="4" class="py-6 text-center text-zinc-500 dark:text-zinc-500">
                    Ingrese el nombre, apellido o DNI del usuario para realizar la consulta.
                  </td>
                </tr>
                <tr v-else v-for="usr in usersList" :key="usr._id" class="border-b border-zinc-100 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900/30">
                  <td class="py-2.5 font-medium text-zinc-800 dark:text-zinc-200">{{ usr.nombre }} {{ usr.apellido }}</td>
                  <td class="py-2.5 font-mono text-zinc-600 dark:text-zinc-450">{{ usr.dni }}</td>
                  <td class="py-2.5 text-zinc-600 dark:text-zinc-400">{{ usr.email }}</td>
                  <td class="py-2.5">
                    <span class="px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase" 
                      :class="usr.rol === 'admin' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'">
                      {{ usr.rol }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Paginación de Usuarios -->
        <div v-if="userPagination.totalPages > 1" class="flex justify-between items-center pt-3 border-t border-zinc-200 dark:border-zinc-800 text-xs">
          <span class="text-zinc-500">Página {{ userPagination.page }} de {{ userPagination.totalPages }}</span>
          <div class="flex space-x-2">
            <button 
              @click="changeUserPage(userPagination.page - 1)" 
              :disabled="userPagination.page <= 1"
              class="px-2.5 py-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Anterior
            </button>
            <button 
              @click="changeUserPage(userPagination.page + 1)" 
              :disabled="userPagination.page >= userPagination.totalPages"
              class="px-2.5 py-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Siguiente
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- Sección 3: Historial de Ventas General -->
    <div class="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm w-full space-y-4 transition-colors duration-200">
      <div class="flex items-center space-x-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <FileText class="h-4.5 w-4.5 text-zinc-400 dark:text-zinc-500" />
        <h3 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Auditoría y Registro de Ventas</h3>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 uppercase tracking-wider font-semibold">
              <th class="py-3">Fecha y Hora</th>
              <th class="py-3">Titular</th>
              <th class="py-3">DNI</th>
              <th class="py-3">Código único de Credencial</th>
              <th class="py-3 text-right">Importe Pagado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="salesList.length === 0">
              <td colspan="5" class="py-8 text-center text-zinc-500">
                No se han registrado transacciones en el sistema.
              </td>
            </tr>
            <tr v-else v-for="sale in salesList" :key="sale._id" class="border-b border-zinc-100 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 text-zinc-700 dark:text-zinc-300 transition-colors duration-100">
              <td class="py-3 text-zinc-500">{{ formatDate(sale.fechaCompra) }}</td>
              <td class="py-3 font-semibold text-zinc-800 dark:text-zinc-200">
                {{ sale.comprador?.nombre || 'Desconocido' }} {{ sale.comprador?.apellido || '' }}
              </td>
              <td class="py-3 font-mono text-zinc-600 dark:text-zinc-400">{{ sale.comprador?.dni || '-' }}</td>
              <td class="py-3">
                <span class="font-mono text-[11px] bg-zinc-100 dark:bg-zinc-950 px-2 py-0.5 border border-zinc-200 dark:border-zinc-800 rounded text-indigo-700 dark:text-indigo-400">
                  {{ sale.codigoUnico }}
                </span>
              </td>
              <td class="py-3 text-right font-semibold text-emerald-600 dark:text-emerald-450">${{ sale.precioPagado.toFixed(2) }} USD</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación de Ventas -->
      <div v-if="salesPagination.totalPages > 1" class="flex justify-between items-center pt-4 border-t border-zinc-200 dark:border-zinc-800 text-xs">
        <span class="text-zinc-500">Página {{ salesPagination.page }} de {{ salesPagination.totalPages }} (Total: {{ salesPagination.totalItems }} registros)</span>
        <div class="flex space-x-2">
          <button 
            @click="changeSalesPage(salesPagination.page - 1)" 
            :disabled="salesPagination.page <= 1"
            class="px-2.5 py-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Anterior
          </button>
          <button 
            @click="changeSalesPage(salesPagination.page + 1)" 
            :disabled="salesPagination.page >= salesPagination.totalPages"
            class="px-2.5 py-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { apiFetch } from "../services/api.ts";
import { Shield, Settings, Search, FileText, Coins, Ticket, Users, CheckCircle2, AlertCircle } from "@lucide/vue";

const successMsg = ref("");
const errorMsg = ref("");

interface Stats {
  ticketsVendidos: number;
  gananciasTotales: number;
}

interface EventConfig {
  aforoTotal: number;
  precioBase: number;
  incremento: number;
}

const stats = ref<Stats>({
  ticketsVendidos: 0,
  gananciasTotales: 0,
});

const config = ref<EventConfig>({
  aforoTotal: 0,
  precioBase: 0,
  incremento: 0,
});

const editConfig = ref({
  aforoTotal: 0,
  precioBase: 0,
  incremento: 0,
});

const updatingConfig = ref(false);

const salesList = ref<any[]>([]);
const salesPagination = ref({
  totalItems: 0,
  totalPages: 0,
  page: 1,
  limit: 5,
});

const userQuery = ref("");
const usersList = ref<any[]>([]);
const userPagination = ref({
  totalItems: 0,
  totalPages: 0,
  page: 1,
  limit: 5,
});

const loadStats = async () => {
  try {
    const data = await apiFetch<Stats>("/admin/stats");
    stats.value = data;
  } catch (err: any) {
    console.error("Error al cargar estadísticas:", err);
    errorMsg.value = err.message || "Error al conectar con estadísticas admin";
  }
};

const loadConfig = async () => {
  try {
    const data = await apiFetch<any>("/config");
    config.value = {
      aforoTotal: data.aforoTotal,
      precioBase: data.precioBase,
      incremento: data.incremento,
    };
    editConfig.value = {
      aforoTotal: data.aforoTotal,
      precioBase: data.precioBase,
      incremento: data.incremento,
    };
  } catch (err: any) {
    console.error("Error al cargar configuración:", err);
  }
};

const handleUpdateConfig = async () => {
  updatingConfig.value = true;
  successMsg.value = "";
  errorMsg.value = "";
  try {
    const res = await apiFetch("/config", {
      method: "PUT",
      body: JSON.stringify(editConfig.value),
    });
    successMsg.value = res.message || "Configuración guardada";
    await loadConfig();
    await loadStats();
  } catch (err: any) {
    console.error("Error al guardar configuración:", err);
    errorMsg.value = err.message || "No se pudo actualizar la configuración";
  } finally {
    updatingConfig.value = false;
  }
};

const loadSales = async (page: number = 1) => {
  try {
    const data = await apiFetch<any>(`/admin/sales?page=${page}&limit=${salesPagination.value.limit}`);
    salesList.value = data.items;
    salesPagination.value = {
      totalItems: data.totalItems,
      totalPages: data.totalPages,
      page: data.page,
      limit: data.limit,
    };
  } catch (err) {
    console.error("Error al cargar ventas:", err);
  }
};

const changeSalesPage = (newPage: number) => {
  if (newPage >= 1 && newPage <= salesPagination.value.totalPages) {
    loadSales(newPage);
  }
};

const triggerUserSearch = () => {
  loadUsers(1);
};

const loadUsers = async (page: number = 1) => {
  try {
    const data = await apiFetch<any>(
      `/admin/users/search?query=${encodeURIComponent(userQuery.value)}&page=${page}&limit=${userPagination.value.limit}`
    );
    usersList.value = data.items;
    userPagination.value = {
      totalItems: data.totalItems,
      totalPages: data.totalPages,
      page: data.page,
      limit: data.limit,
    };
  } catch (err: any) {
    console.error("Error al buscar usuarios:", err);
    errorMsg.value = err.message || "Fallo en la búsqueda de usuarios";
  }
};

const changeUserPage = (newPage: number) => {
  if (newPage >= 1 && newPage <= userPagination.value.totalPages) {
    loadUsers(newPage);
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

onMounted(() => {
  loadStats();
  loadConfig();
  loadSales(1);
});
</script>
