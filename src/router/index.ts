import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/presentations/dashboard/DashboardView.vue"),
      children: [
        {
          path: "",
          name: "dashboard",
          component: () =>
            import("@/presentations/dashboard/DashboardHome.vue"),
        },
        {
          path: "game/:id",
          name: "game",
          component: () => import("@/presentations/game/GameView.vue"),
        },
      ],
    },
  ],
});

export default router;
