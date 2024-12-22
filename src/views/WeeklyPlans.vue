<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import DailyPlan from "@/views/DailyPlan.vue";
import { PlanService } from "@/service/planService.js";
import { PlanType } from "@/type/plan_type.ts";
import { useDateState } from "@/composables/useDateState.ts";
import { useWeekStore } from "@/stores/weekStore.ts";

const divStyle = {
  height: "78vh",
};

const { weekStore, startOfWeek, startDate, endDate } = useDateState();

// 요일 배열
const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

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

const isLoaded = ref(false);

// 일정 데이터
const plans = ref<PlanType[]>([]);

// 날짜별 플랜 매핑
const dailyPlans = ref<{ [key: string]: PlanType[] }>({});

async function fetchPlans() {
  plans.value = (
    await PlanService.getInstance().getDailyPlans(
      startDate.value,
      endDate.value,
    )
  ).data;
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

async function handleFetchPlansEvent() {
  await fetchPlans();
  await mapPlansToDates();
}

onMounted(async () => {
  await handleFetchPlansEvent();
});

// 주차 정보 변경 시 업데이트
watch(
  () => weekStore.currentDate,
  async () => {
    await handleFetchPlansEvent();
  },
);

watch(
  () => weekStore.triggerForWeeklyPlans,
  async (newVal) => {
    if (newVal) {
      console.log("sdadsdas");
      await fetchPlans();
      await mapPlansToDates();
      weekStore.resetPlanTrigger();
    }
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
        :key="datesOfWeek[index].toISOString()"
        :day="day"
        :date="datesOfWeek[index]"
        :plans="dailyPlans[datesOfWeek[index].toDateString()]"
        :isToday="datesOfWeek[index].toDateString() === today.toDateString()"
        @update:plans="handleFetchPlansEvent"
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
