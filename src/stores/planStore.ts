import { defineStore } from "pinia";

export const usePlanStore = defineStore("plan", {
  state: () => ({
    currentWeeklyTargets: [], // 현재 주차 목표
  }),
  getters: {
    getCurrentWeeklyTargets(state) {
      return state.currentWeeklyTargets;
    },
  },
  actions: {
    setCurrentWeeklyTargets(targets) {
      this.currentWeeklyTargets = targets;
    },
  },
});
