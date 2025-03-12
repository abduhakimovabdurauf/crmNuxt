import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useRuntimeConfig, useFetch } from "#app";

export const useAuthStore = defineStore("auth", () => {
    const token = ref(localStorage.getItem("jwt-token"));
    const router = useRouter();
    const toast = useToast();
    const config = useRuntimeConfig();

    const setToken = (newToken) => {
        token.value = newToken;
        localStorage.setItem("jwt-token", newToken);
        localStorage.setItem("jwt-token-expiry", Date.now() + 8 * 60 * 60 * 1000);
    };

    const logout = () => {
        token.value = null;
        localStorage.removeItem("jwt-token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    const login = async (payload) => {
        try {
            const { data, error } = await useFetch("/login", {
                method: "POST",
                baseURL: config.public.apiBase,
                body: payload,
            });

            if (error.value) throw error.value;

            setToken(data.value.token);
            localStorage.setItem("user", JSON.stringify(data.value.user));

            toast.success(data.value.message || "Login successful!");
            return data.value.user;
        } catch (e) {
            console.error(e.message);
            toast.error(e.message || "Login failed!");
        }
    };

    const checkToken = () => {
        const savedToken = localStorage.getItem("jwt-token");
        const expiry = localStorage.getItem("jwt-token-expiry");

        if (savedToken && expiry) {
            if (Date.now() > expiry) {
                localStorage.removeItem("jwt-token");
                localStorage.removeItem("jwt-token-expiry");
                console.error("Token muddati tugagan!");
                logout();
            } else {
                setToken(savedToken);
            }
        } else {
            logout();
        }
    };

    return { token, isAuthenticated: computed(() => !!token.value), login, logout, checkToken };
});
