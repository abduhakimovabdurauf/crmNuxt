import { useMainStore } from '~/stores/main.js';
import { useAuthStore } from "~/stores/auth.js";
import { useToast } from "vue-toastification";

export default defineNuxtRouteMiddleware((to) => {
    const store = useMainStore();
    const authStore = useAuthStore();
    const requireAuth = to.meta?.auth;
    const user = process.client ? JSON.parse(localStorage.getItem("user")) : null;
    const userRoles = user?.roles?.map(r => r.name) || ['guest'];
    const toast = useToast()
    console.log('auth:', requireAuth);
    store.closeSidebar();

    if (authStore.isAuthenticated && to.path === '/login') {
        return navigateTo('/dashboard');
    }

    if (requireAuth && authStore.isAuthenticated) {
        const allowedRoles = to.meta?.roles;
        const hasAccess = userRoles.some(r => allowedRoles.some(role => role === r)) || allowedRoles.includes('all');

        if (!hasAccess) {
            toast.warning('Sizga bu sahifaga kirish ruhsati berilmagan!');
            return navigateTo('/profile');
        }
    }

    if (requireAuth && !authStore.isAuthenticated) {
        console.log('else:', requireAuth);
        return navigateTo('/login');
    }
});
