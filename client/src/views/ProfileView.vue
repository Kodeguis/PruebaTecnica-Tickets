<template>
  <div class="max-w-6xl mx-auto px-4 py-12 flex-grow space-y-8 w-full">
    
    <!-- Encabezado de Perfil -->
    <div class="flex items-center space-x-3 pb-4 border-b border-zinc-200 dark:border-zinc-900 transition-colors duration-250">
      <User class="h-8 w-8 text-indigo-500" />
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Mi Perfil</h1>
        <p class="text-xs text-zinc-500 dark:text-zinc-400">Administre sus datos personales y consulte su historial de pases corporativos.</p>
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

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Panel de Edición de Perfil -->
      <div class="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm lg:col-span-1 space-y-4 transition-all duration-300">
        <div class="flex items-center space-x-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <FileText class="h-4.5 w-4.5 text-zinc-400 dark:text-zinc-500" />
          <h3 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Datos Personales</h3>
        </div>

        <form @submit.prevent="handleUpdateProfile" class="space-y-4">
          <!-- Campo: Email (Solo lectura) -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-semibold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider">Correo Electrónico (No editable)</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-650">
                <Mail class="h-4 w-4" />
              </span>
              <input 
                :value="authStore.user?.email"
                type="email" 
                disabled
                class="w-full bg-zinc-100/60 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-900 rounded pl-9 pr-3.5 py-2 text-sm text-zinc-500 dark:text-zinc-500 cursor-not-allowed"
              />
            </div>
          </div>

          <!-- Campo: Nombre -->
          <div class="space-y-1.5">
            <label for="nombre" class="text-[10px] font-semibold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider">Nombre</label>
            <input 
              v-model="nombre" 
              type="text" 
              id="nombre"
              required
              class="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-650 transition-colors"
            />
          </div>

          <!-- Campo: Apellido -->
          <div class="space-y-1.5">
            <label for="apellido" class="text-[10px] font-semibold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider">Apellido</label>
            <input 
              v-model="apellido" 
              type="text" 
              id="apellido"
              required
              class="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-650 transition-colors"
            />
          </div>

          <!-- Campo: DNI -->
          <div class="space-y-1.5">
            <label for="dni" class="text-[10px] font-semibold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider">DNI (Identificación)</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-605">
                <IdCard class="h-4 w-4" />
              </span>
              <input 
                v-model="dni" 
                type="text" 
                id="dni"
                required
                class="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded pl-9 pr-3.5 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-650 transition-colors"
              />
            </div>
          </div>

          <!-- Campo: Contraseña Opcional -->
          <div class="space-y-1.5">
            <label for="password" class="text-[10px] font-semibold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider">Nueva Contraseña (Opcional)</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-605">
                <Lock class="h-4 w-4" />
              </span>
              <input 
                v-model="contrasena" 
                type="password" 
                id="password"
                placeholder="Dejar en blanco para mantener"
                minlength="6"
                class="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded pl-9 pr-3.5 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-650 transition-colors"
              />
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="updatingProfile"
            class="w-full px-4 py-2 rounded text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-150 shadow-sm flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer"
          >
            <span v-if="updatingProfile" class="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span v-else>Guardar Cambios</span>
          </button>
        </form>
      </div>

      <!-- Panel de Historial de Pases (Mis Tickets) -->
      <div class="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm lg:col-span-2 flex flex-col justify-between space-y-4 transition-all duration-300">
        <div class="space-y-4">
          <div class="flex items-center space-x-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <Ticket class="h-4.5 w-4.5 text-zinc-400 dark:text-zinc-500" />
            <h3 class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Mis Pases de Acceso</h3>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 uppercase tracking-wider font-semibold">
                  <th class="py-2.5">Fecha de Compra</th>
                  <th class="py-2.5">Código único</th>
                  <th class="py-2.5">Importe</th>
                  <th class="py-2.5 text-right">Detalle</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loadingTickets">
                  <td colspan="4" class="py-8 text-center text-zinc-500">
                    Cargando historial de pases...
                  </td>
                </tr>
                <tr v-else-if="ticketsList.length === 0">
                  <td colspan="4" class="py-8 text-center text-zinc-500">
                    Aún no ha adquirido ningún pase para el evento. 
                    <router-link to="/" class="text-indigo-650 dark:text-indigo-400 hover:underline font-semibold ml-1">Adquirir uno ahora</router-link>.
                  </td>
                </tr>
                <tr v-else v-for="tkt in ticketsList" :key="tkt._id" class="border-b border-zinc-100 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors duration-100">
                  <td class="py-2.5 text-zinc-600 dark:text-zinc-400">{{ formatDate(tkt.fechaCompra) }}</td>
                  <td class="py-2.5">
                    <span class="font-mono text-[11px] bg-zinc-100 dark:bg-zinc-950 px-2 py-0.5 border border-zinc-200 dark:border-zinc-800 rounded text-indigo-700 dark:text-indigo-400">
                      {{ tkt.codigoUnico }}
                    </span>
                  </td>
                  <td class="py-2.5 text-zinc-800 dark:text-zinc-300">${{ tkt.precioPagado.toFixed(2) }} USD</td>
                  <td class="py-2.5 text-right">
                    <router-link 
                      :to="{ name: 'ticket-detail', params: { ticketId: tkt._id } }"
                      class="inline-flex items-center space-x-1 text-[11px] text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 hover:underline dark:hover:text-white transition-colors"
                    >
                      <span>Ver pase</span>
                      <ExternalLink class="h-3 w-3" />
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Paginación de Tickets -->
        <div v-if="ticketsPagination.totalPages > 1" class="flex justify-between items-center pt-3 border-t border-zinc-200 dark:border-zinc-800 text-xs">
          <span class="text-zinc-500">Página {{ ticketsPagination.page }} de {{ ticketsPagination.totalPages }}</span>
          <div class="flex space-x-2">
            <button 
              @click="changeTicketsPage(ticketsPagination.page - 1)" 
              :disabled="ticketsPagination.page <= 1"
              class="px-2.5 py-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
            >
              Anterior
            </button>
            <button 
              @click="changeTicketsPage(ticketsPagination.page + 1)" 
              :disabled="ticketsPagination.page >= ticketsPagination.totalPages"
              class="px-2.5 py-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
            >
              Siguiente
            </button>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { authStore } from "../services/authStore.ts";
import { apiFetch } from "../services/api.ts";
import { User, FileText, Mail, IdCard, Lock, Ticket, ExternalLink, CheckCircle2, AlertCircle } from "@lucide/vue";

const successMsg = ref("");
const errorMsg = ref("");

// Campos del formulario
const nombre = ref(authStore.user?.nombre || "");
const apellido = ref(authStore.user?.apellido || "");
const dni = ref(authStore.user?.dni || "");
const contrasena = ref("");

const updatingProfile = ref(false);

// Listado de tickets
const ticketsList = ref<any[]>([]);
const loadingTickets = ref(true);
const ticketsPagination = ref({
  totalItems: 0,
  totalPages: 0,
  page: 1,
  limit: 5,
});

// Guardar cambios del perfil
const handleUpdateProfile = async () => {
  updatingProfile.value = true;
  successMsg.value = "";
  errorMsg.value = "";
  try {
    const payload: any = {
      nombre: nombre.value,
      apellido: apellido.value,
      dni: dni.value,
    };
    if (contrasena.value.trim().length > 0) {
      payload.contrasena = contrasena.value;
    }

    const res = await apiFetch<any>("/auth/update", {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    // Actualizamos el usuario en el store global
    authStore.user = res.user;
    successMsg.value = res.message || "Perfil actualizado correctamente";
    contrasena.value = ""; // Limpiar el input
  } catch (err: any) {
    console.error("Error al actualizar perfil:", err);
    errorMsg.value = err.message || "Error al intentar actualizar la información del perfil";
  } finally {
    updatingProfile.value = false;
  }
};

// Cargar pases de usuario
const loadUserTickets = async (page: number = 1) => {
  loadingTickets.value = true;
  try {
    const data = await apiFetch<any>(`/tickets/my?page=${page}&limit=${ticketsPagination.value.limit}`);
    ticketsList.value = data.items;
    ticketsPagination.value = {
      totalItems: data.totalItems,
      totalPages: data.totalPages,
      page: data.page,
      limit: data.limit,
    };
  } catch (err) {
    console.error("Error al cargar tickets comprados:", err);
  } finally {
    loadingTickets.value = false;
  }
};

const changeTicketsPage = (newPage: number) => {
  if (newPage >= 1 && newPage <= ticketsPagination.value.totalPages) {
    loadUserTickets(newPage);
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
  loadUserTickets(1);
});
</script>
