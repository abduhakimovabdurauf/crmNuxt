import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
    state: () => ({
        selectedCategory: 'all',
        isSidebarOpen: false,
        sidebarValues: null,
        message: null,
        loading: false,
        sortLoading: false,
    }),

    getters: {
        isLoading: (state) => state.loading,
        isSortLoading: (state) => state.sortLoading,
        isSidebarOpen: (state) => state.isSidebarOpen,
    },

    actions: {
        setSidebar(payload) {
            this.isSidebarOpen = payload;
        },
        setLoading(status) {
            this.loading = status;
        },
        setSortLoading(status) {
            this.sortLoading = status;
        },
        closeSidebar() {
            this.isSidebarOpen = false;
        },
        toggleSidebar(isOpen) {
            this.isSidebarOpen = isOpen;
        },
    },
});
