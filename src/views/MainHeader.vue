<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useWeekStore } from "../stores/weekStore";
import "primeicons/primeicons.css";
import { useModeStore } from "@/stores/modeStore.ts";

const weekStore = useWeekStore();
const modeStore = useModeStore();

const currentViewMode = computed(() => modeStore.getCurrentViewMode);

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

onMounted(() => {
  modeStore.initializeViewMode();
});
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
        <i class="pi pi-angle-left fs-4"></i>
      </button>

      <!-- 제목 텍스트 -->
      <h1 class="mx-3 my-0 display-4">TODO Planner</h1>

      <!-- 다음 주 버튼 -->
      <button class="btn btn-link text-white p-0" @click="nextWeek">
        <i class="pi pi-angle-right fs-4"></i>
      </button>
    </div>

    <!-- chart-bar 아이콘을 헤더 하단에 고정 -->
    <div
      v-if="currentViewMode === 'plan-view'"
      class="position-absolute bottom-0 start-50 translate-middle-x p-3"
    >
      <button
        class="btn btn-link text-white p-0"
        @click="modeStore.toggleCurrentViewMode"
      >
        <i class="pi pi-chart-bar fs-4"></i>
      </button>
    </div>
    <div
      v-else-if="currentViewMode === 'statistic-view'"
      class="position-absolute bottom-0 start-50 translate-middle-x p-3"
    >
      <button
        class="btn btn-link text-white p-0"
        @click="modeStore.toggleCurrentViewMode"
      >
        <i class="pi pi-calendar-minus fs-4"></i>
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
  position: relative; /* position-absolute를 정상적으로 동작시키기 위해 필요 */
}

.date-info {
  font-size: 1.3rem;
}

h1 {
  margin: 0;
}

.btn-link {
  font-size: 1.5rem;
  padding: 0;
}
</style>
