<script setup lang="ts">

import { ref } from "vue";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] ;

// 요일별 계획 데이터
const dailyPlans = ref(
    days.map((day) => ({
      day,
      plans: [], // 각 요일에 계획을 저장할 배열
    }))
);

// 계획 추가
const addPlan = (dayIndex: number) => {
  const newPlan = prompt(`Add a plan for ${dailyPlans.value[dayIndex].day}:`);
  if (newPlan) {
    dailyPlans.value[dayIndex].plans.push(newPlan);
  }
};
</script>

<template>
  <div class="daily-plans">
    <div
        v-for="(dayData, index) in dailyPlans"
        :key="dayData.day"
        class="day-column"
    >
      <h3 class="day-title">{{ dayData.day }}</h3>
      <ul class="plan-list">
        <li v-for="(plan, planIndex) in dayData.plans" :key="planIndex">
          {{ plan }}
        </li>
      </ul>
      <button @click="addPlan(index)" class="add-plan-button">Add Plan</button>
    </div>
  </div>
</template>

<style scoped>
/* 전체 일별 계획 영역 */
.daily-plans {
  display: flex;
  flex: 8;
}

.day-column {
  flex: 1; /* 각 요일 칸 동일한 크기 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 16px;
  border-left: 1px solid #ddd; /* 칸 구분 */
  background-color: white;
}

.day-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: center;
  color: black;
}

/* 계획 리스트 */
.plan-list {
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
}

.plan-item {
  font-size: 14px;
  margin-bottom: 8px;
}

/* 계획 추가 버튼 */
.add-plan-button {
  margin-top: 8px;
  padding: 8px;
  background-color: #6c63ff;
  color: white;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-plan-button:hover {
  background-color: #5750d3;
}
</style>
