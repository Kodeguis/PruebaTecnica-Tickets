import { reactive } from "vue";
import { apiFetch } from "./api.ts";

export interface User {
  _id: string;
  dni: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: "user" | "admin";
}

// Almacén reactivo de la sesión del usuario
export const authStore = reactive({
  user: null as User | null,
  isAuthenticated: false,
  checkingSession: true, // Indica si se está comprobando la sesión al cargar la app

  // Comprueba si el usuario tiene una sesión activa al cargar la página
  async checkSession() {
    this.checkingSession = true;
    try {
      const data = await apiFetch<{ user: User }>("/auth/me");
      this.user = data.user;
      this.isAuthenticated = true;
    } catch (error) {
      this.user = null;
      this.isAuthenticated = false;
    } finally {
      this.checkingSession = false;
    }
  },

  // Iniciar sesión
  async login(email: string, contrasena: string) {
    try {
      const data = await apiFetch<{ user: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, contrasena }),
      });
      this.user = data.user;
      this.isAuthenticated = true;
      return data.user;
    } catch (error) {
      this.logoutLocal();
      throw error;
    }
  },

  // Registrar un usuario
  async register(dni: string, email: string, nombre: string, apellido: string, contrasena: string) {
    return apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ dni, email, nombre, apellido, contrasena }),
    });
  },

  // Cerrar sesión
  async logout() {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Error al cerrar sesión en el servidor:", error);
    } finally {
      this.logoutLocal();
    }
  },

  // Limpia el estado local de sesión
  logoutLocal() {
    this.user = null;
    this.isAuthenticated = false;
    this.checkingSession = false;
  }
});
