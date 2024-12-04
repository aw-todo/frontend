<script setup lang="ts">
import { computed } from "vue";
import { useWeekStore } from "../stores/weekStore";
import "primeicons/primeicons.css";

const weekStore = useWeekStore();

const currentDate = computed(() => weekStore.currentDate);

const currentYear = computed(() => currentDate.value.getFullYear());
const currentMonth = computed(() => currentDate.value.getMonth() + 1);
const currentWeek = computed(() => getWeekNumberInMonth(currentDate.value));

// 주차 계산 함수
function getWeekNumberInMonth(date) {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfMonth = date.getDate();
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0: 일요일, ..., 6: 토요일

  // 첫 주의 남은 일수 계산
  const firstWeekRemainingDays = 7 - startDayOfWeek;

  if (dayOfMonth <= firstWeekRemainingDays) {
    return 1;
  } else {
    return Math.ceil((dayOfMonth - firstWeekRemainingDays) / 7) + 1;
  }
}

function previousWeek() {
  weekStore.previousWeek();
}

function nextWeek() {
  weekStore.nextWeek();
}
</script>

<template>
  <header class="main-header position-relative" style="height: 20vh">
    <!-- 날짜 정보 표시 -->
    <div class="date-info text-center">
      {{ currentYear }}년 {{ currentMonth }}월 {{ currentWeek }}주차
    </div>

    <!-- 주차 이동 버튼과 제목을 함께 배치 -->
    <div class="d-flex align-items-center justify-content-center">
      <!-- 이전 주 버튼 -->
      <button class="btn btn-link text-white p-0" @click="previousWeek">
        <i class="pi pi-angle-left"></i>
      </button>

      <!-- 제목 텍스트 -->
      <h1 class="mx-3 my-0">TODO Planner</h1>

      <!-- 다음 주 버튼 -->
      <button class="btn btn-link text-white p-0" @click="nextWeek">
        <i class="pi pi-angle-right"></i>
      </button>
    </div>
  </header>
</template>

<style scoped>
.main-header {
  background-color: #007bff;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.date-info {
  font-size: 1.1rem;
}

h1 {
  margin: 0;
}

.btn-link {
  font-size: 1.5rem;
  padding: 0;
}
</style>
