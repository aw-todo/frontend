<script setup lang="ts">
import { computed } from "vue";
import { useWeekStore } from "../stores/weekStore";
import Button from "primevue/button";

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
  <header
    class="main-header d-flex flex-column align-items-center justify-content-center position-relative"
    style="height: 20vh"
  >
    <!-- 주차 이동 버튼 -->
    <div
      class="navigation-buttons position-absolute w-100 d-flex justify-content-between px-3"
    >
      <Button class="btn btn-link text-white" @click="previousWeek">
        <i class="pi pi-chevron-left"></i>
      </Button>
      <Button class="btn btn-link text-white" @click="nextWeek">
        <i class="pi pi-chevron-right"></i>
      </Button>
    </div>
    <!-- 날짜 정보 표시 -->
    <div class="date-info">
      {{ currentYear }}년 {{ currentMonth }}월 {{ currentWeek }}주차
    </div>
    <h1>TODO Planner</h1>
  </header>
</template>

<style scoped>
.main-header {
  background-color: #007bff;
  color: #fff;
  position: relative;
}

.date-info {
  position: absolute;
  top: 10px;
  font-size: 0.8rem;
}

.navigation-buttons {
  top: 0;
  height: 100%;
}

h1 {
  margin: 0;
}
</style>
