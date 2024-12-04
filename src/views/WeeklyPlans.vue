<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useWeekStore } from "@/stores/weekStore.ts";
import DailyPlan from "@/views/DailyPlan.vue";
import { PlanService } from "@/service/PlanService.ts";
import { PlanType } from "@/type/plan_type.ts";

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

const startDate = computed(() => {
  return formatDate(startOfWeek.value);
});

const endDate = computed(() => {
  const endOfWeekDate = new Date(startOfWeek.value);
  endOfWeekDate.setDate(endOfWeekDate.getDate() + 6); // 주의 마지막 날 계산
  return formatDate(endOfWeekDate);
});

const isLoaded = ref(false);

// 일정 데이터
const plans = ref<PlanType[]>([]);

// 날짜별 플랜 매핑
const dailyPlans = ref<{ [key: string]: PlanType[] }>({});

function formatDate(date) {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 +1
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

async function fetchPlans() {
  const response = await PlanService.getInstance().getPlans(
    startDate.value,
    endDate.value,
  );
  plans.value = response.data;
}

// 플랜을 날짜별로 매핑하는 함수
async function mapPlansToDates() {
  // dailyPlans 초기화
  dailyPlans.value = {};

  // 각 날짜별로 빈 배열 초기화
  datesOfWeek.value.forEach((date) => {
    const key = date.toDateString();
    dailyPlans.value[key] = [];
  });
  // 플랜들을 날짜별로 분류
  plans.value.forEach((plan) => {
    const planDate = new Date(plan.startDate);
    const planDateKey = planDate.toDateString();

    // 만약 해당 주의 날짜에 플랜이 있으면 추가
    if (dailyPlans.value[planDateKey]) {
      dailyPlans.value[planDateKey].push(plan);
    }
  });
  isLoaded.value = true;
}

onMounted(async () => {
  await fetchPlans();
  mapPlansToDates();
});

// 주차 정보 변경 시 업데이트
watch(
  () => weekStore.currentDate,
  () => {
    mapPlansToDates();
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
    <div v-if="isLoaded" class="row h-100 no-gutters">
      <DailyPlan
        v-for="(day, index) in daysOfWeek"
        :key="index"
        :day="day"
        :date="datesOfWeek[index]"
        :plans="dailyPlans[datesOfWeek[index].toDateString()]"
        :isToday="datesOfWeek[index].toDateString() === today.toDateString()"
      />
    </div>
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
</style>
