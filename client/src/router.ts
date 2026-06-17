import { createRouter, createWebHistory } from "vue-router";
import { authStore } from "./services/authStore.ts";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("./views/HomeView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./views/LoginView.vue"),
    meta: { guestOnly: true },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("./views/RegisterView.vue"),
    meta: { guestOnly: true },
  },
  {
    path: "/ticket/:ticketId",
    name: "ticket-detail",
    component: () => import("./views/TicketView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("./views/ProfileView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    name: "admin-dashboard",
    component: () => import("./views/AdminView.vue"),
    meta: { requiresAuth: true, adminOnly: true },
  },
  // Redirección por defecto para cualquier ruta no encontrada
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard de navegación global para proteger rutas
router.beforeEach((to, _from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const adminOnly = to.matched.some((record) => record.meta.adminOnly);
  const guestOnly = to.matched.some((record) => record.meta.guestOnly);

  // Si estamos en medio de la comprobación de sesión inicial, no tomamos decisiones aún
  if (authStore.checkingSession) {
    next();
    return;
  }

  // 1. Si la ruta requiere autenticación y el usuario no está logueado
  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: "login" });
    return;
  }

  // 2. Si la ruta es exclusiva para administrador y el usuario no lo es
  if (adminOnly && authStore.user?.rol !== "admin") {
    next({ name: "home" });
    return;
  }

  // 3. Si la ruta es solo para invitados (login/registro) y el usuario ya está autenticado
  if (guestOnly && authStore.isAuthenticated) {
    next({ name: "home" });
    return;
  }

  // Si pasa todas las validaciones, permite el acceso
  next();
});

export default router;
