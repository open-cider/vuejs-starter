import { createRouter, createWebHistory } from "vue-router";
import { getToken } from "./lib/session";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/dashboard" },
    { path: "/login", component: () => import("./views/LoginView.vue") },
    {
      path: "/dashboard",
      component: () => import("./views/DashboardView.vue"),
      meta: { requiresAuth: true },
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

// Fast, optimistic gate: it only checks that a token is stored.
// The dashboard validates it with Open Cider when it loads.
router.beforeEach((to) => {
  const hasToken = Boolean(getToken());
  if (to.meta.requiresAuth && !hasToken) return "/login";
  if (to.path === "/login" && hasToken) return "/dashboard";
});
