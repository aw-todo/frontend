import { defineStore } from "pinia";

export const useWeekStore = defineStore("week", {
  state: () => ({
    currentDate: new Date(), // 현재 날짜를 기준으로 주차를 계산합니다
    plans: {}, // 일정 데이터를 저장합니다
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
    addPlan(date, plan) {
      const key = date.toDateString();
      if (!this.plans[key]) {
        this.plans[key] = [];
      }
      this.plans[key].push(plan);
    },
  },
});
