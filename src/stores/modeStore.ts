import { defineStore } from "pinia";

export const useModeStore = defineStore("mode", {
  state: () => ({
    currentViewMode: "plan-view",
  }),
  getters: {
    getCurrentViewMode(state) {
      return state.currentViewMode;
    },
  },
  actions: {
    toggleCurrentViewMode() {
      if (this.currentViewMode === "plan-view") {
        this.currentViewMode = "statistic-view";
      } else if (this.currentViewMode === "statistic-view") {
        this.currentViewMode = "plan-view";
      }
      localStorage.setItem("currentViewMode", this.currentViewMode);
    },
    initializeViewMode() {
      const savedMode = localStorage.getItem("currentViewMode");
      if (savedMode) {
        this.currentViewMode = savedMode;
      }
    },
  },
});
