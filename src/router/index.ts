import { createRouter, createWebHistory } from "vue-router";

// 라우트 정의
const routes = [
  {
    path: "/",
    name: "MainPage",
  },
];

// Router 생성
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
