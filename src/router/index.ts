import { createRouter, createWebHistory } from 'vue-router';
import MainPage from "../views/MainPage.vue";

// 라우트 정의
const routes = [
    {
        path: '/',
        name: 'MainPage',
        component: MainPage,
    },
];

// Router 생성
const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;