<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useWeekStore } from "@/stores/weekStore.ts";
import DailyPlan from "@/views/DailyPlan.vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

const divStyle = {
  height: "80vh",
  overflowY: "auto",
};

const weekStore = useWeekStore();

// 현재 날짜 및 주차 정보 가져오기
const currentDate = computed(() => weekStore.currentDate);

// 요일 배열
const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

// 주의 시작일 계산 (일요일 기준)
const startOfWeek = computed(() => {
  const date = new Date(currentDate.value);
  date.setDate(date.getDate() - date.getDay());
  return date;
});

// 요일별 날짜 매핑
const datesOfWeek = computed(() => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek.value);
    date.setDate(startOfWeek.value.getDate() + i);
    dates.push(date);
  }
  return dates;
});

// 일정 데이터 초기화
const dailyPlans = ref<{ [key: string]: string[] }>({});

// 각 날짜별로 일정 배열 초기화
function initializePlans() {
  datesOfWeek.value.forEach((date) => {
    const key = date.toDateString();
    if (!dailyPlans.value[key]) {
      dailyPlans.value[key] = []; // 초기화
    }
  });
}

// 플랜 추가 함수
const dialogVisible = ref(false);
const newPlan = ref("");
let selectedDate = null;

function addPlan(date) {
  selectedDate = date;
  newPlan.value = "";
  dialogVisible.value = true;
}

function confirmAddPlan() {
  if (newPlan.value.trim()) {
    dailyPlans.value[selectedDate.toDateString()].push(newPlan.value.trim());
  }
  dialogVisible.value = false;
}

onMounted(() => {
  // 컴포넌트가 마운트될 때 초기화
  initializePlans();
});

// 주차 정보 변경 시 업데이트
watch(
  () => weekStore.currentDate,
  () => {
    initializePlans();
  },
);

// 오늘 날짜 계산
const today = computed(() => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
});
</script>

<!-- src/components/WeeklyPlans.vue -->
<template>
  <div :style="divStyle">
    <div class="row h-100 no-gutters">
      <DailyPlan
        v-for="(day, index) in daysOfWeek"
        :key="index"
        :day="day"
        :date="datesOfWeek[index]"
        :plans="dailyPlans[datesOfWeek[index].toDateString()]"
        :isToday="datesOfWeek[index].toDateString() === today.toDateString()"
        :addPlan="addPlan"
      />
    </div>
    <!-- 플랜 추가 다이얼로그 -->
    <Dialog v-model:visible="dialogVisible" header="계획 추가">
      <div class="p-fluid">
        <div class="field">
          <label for="plan">플랜 내용</label>
          <InputText id="plan" v-model="newPlan" />
        </div>
      </div>
      <template #footer>
        <Button
          label="취소"
          icon="pi pi-times"
          @click="dialogVisible = false"
          class="p-button-text"
        />
        <Button label="추가" icon="pi pi-check" @click="confirmAddPlan" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.row.no-gutters {
  margin-right: 0;
  margin-left: 0;
}

.row.no-gutters > [class*="col-"] {
  padding-right: 0;
  padding-left: 0;
}

/* 필요한 경우 추가 스타일 */
</style>
