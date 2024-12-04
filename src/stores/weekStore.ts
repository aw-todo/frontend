import { defineStore } from "pinia";

export const useWeekStore = defineStore("week", {
  state: () => ({
    currentDate: new Date(), // 현재 날짜를 기준으로 주차를 계산합니다
    triggerForWeeklyTargets: false,
    triggerForWeeklyPlans: false,
  }),
  actions: {
    nextWeek() {
      const newDate = new Date(this.currentDate);
      newDate.setDate(newDate.getDate() + 7);
      this.currentDate = newDate;
    },
    previousWeek() {
      const newDate = new Date(this.currentDate);
      newDate.setDate(newDate.getDate() - 7);
      this.currentDate = newDate;
    },
    triggerTargetsFunction() {
      this.triggerForWeeklyTargets = true;
    },
    resetTargetTrigger() {
      this.triggerForWeeklyTargets = false;
    },
    triggerPlansFunction() {
      this.triggerForWeeklyPlans = true;
    },
    resetPlanTrigger() {
      this.triggerForWeeklyPlans = false;
    },
  },
});
