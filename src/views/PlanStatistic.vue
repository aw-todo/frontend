<script setup lang="ts">
import { onMounted, onUpdated, ref, watch } from "vue";
import { useDateState } from "@/composables/useDateState.ts";
import DailyStatistic from "@/views/components/DailyStatistic.vue";
import WeeklyStatistic from "@/views/components/WeeklyStatistic.vue";
import { StatisticService } from "@/service/statisticService.ts";

const isLoaded = ref(false);

const { startDate, endDate } = useDateState();

const dailyStatisticData = ref([]);
const weeklyStatisticData = ref({});

const getStatistics = async () => {
  await getDailyStatistic();
  await getWeeklyStatistic();
  isLoaded.value = true;
};

const getDailyStatistic = async () => {
  const response = await StatisticService.getInstance().getDailyStatistic(
    startDate.value,
    endDate.value,
  );
  dailyStatisticData.value = response.data;
};

const getWeeklyStatistic = async () => {
  const response = await StatisticService.getInstance().getWeeklyStatistic(
    startDate.value,
    endDate.value,
  );
  weeklyStatisticData.value = response.data;
};

onMounted(async () => {
  await getStatistics();
});

watch(
  () => startDate.value,
  async () => {
    await getStatistics();
  },
);
</script>

<template>
  <div v-if="isLoaded" class="row w-100 m-0 p-2" style="height: 40vh">
    <!-- 주간 차트 영역 -->
    <div class="col-4 p-0">
      <div class="card h-100">
        <div class="card-body">
          <h4 class="card-title">주간 달성 비율</h4>
          <WeeklyStatistic :data="weeklyStatisticData" />
        </div>
      </div>
    </div>

    <!-- 일간 차트 영역: 나머지 공간 전부 차지 -->
    <div class="col ms-3 p-0">
      <div class="card h-100">
        <div class="card-body">
          <h4 class="card-title">요일별 달성 비율</h4>
          <DailyStatistic :data="dailyStatisticData" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
