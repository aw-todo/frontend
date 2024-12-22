<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useDateState } from "@/composables/useDateState.ts";
import DailyStatistic from "@/views/components/DailyStatistic.vue";
import WeeklyStatistic from "@/views/components/WeeklyStatistic.vue";
import { StatisticService } from "@/service/statisticService.ts";
import { StatisticType } from "@/type/statistic_type.ts";
import { generateDateRange } from "@/utils/dateUtils.ts";

const isLoaded = ref(false);

const { startDate, endDate } = useDateState();

const dailyStatisticData = ref<StatisticType[]>([]);
const weeklyStatisticData = ref({});

const generateDefaultWeeklyData = async (
  startDate: string,
  endDate: string,
): StatisticType[] => {
  const dates = generateDateRange(startDate, endDate);
  return dates.map((date) => ({
    date,
    total: 0,
    done: 0,
    notDone: 0,
    ratio: 0,
  }));
};

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
  mergeWeeklyData(response.data);
};

const getWeeklyStatistic = async () => {
  const response = await StatisticService.getInstance().getWeeklyStatistic(
    startDate.value,
    endDate.value,
  );
  weeklyStatisticData.value = response.data;
  console.log(response.data);
};

const mergeWeeklyData = (fetchedData: StatisticType[]) => {
  // 데이터를 빠르게 찾기 위한 맵 생성
  const fetchedDataMap = new Map(fetchedData.map((item) => [item.date, item]));

  // 기본 데이터에 백엔드 데이터를 덮어씀
  const mergedData = dailyStatisticData.value.map((defaultItem) => {
    const fetchedItem = fetchedDataMap.get(defaultItem.date);
    if (fetchedItem) {
      const ratio = fetchedItem.total
        ? (fetchedItem.done / fetchedItem.total) * 100
        : 0;
      return { ...defaultItem, ...fetchedItem, ratio };
    }
    return defaultItem;
  });

  dailyStatisticData.value = mergedData;
};

onMounted(async () => {
  dailyStatisticData.value = await generateDefaultWeeklyData(
    startDate.value,
    endDate.value,
  );
  await getStatistics();
});

watch(
  () => startDate.value,
  async () => {
    dailyStatisticData.value = await generateDefaultWeeklyData(
      startDate.value,
      endDate.value,
    );
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
          <h4 class="card-title">
            주간 계획 달성 비율 : {{ weeklyStatisticData.doneRatio * 100 }}%
          </h4>
          <WeeklyStatistic :data="weeklyStatisticData" />
        </div>
      </div>
    </div>

    <!-- 일간 차트 영역: 나머지 공간 전부 차지 -->
    <div class="col ms-3 p-0">
      <div class="card h-100">
        <div class="card-body">
          <h4 class="card-title">요일별 계획 달성 비율</h4>
          <DailyStatistic :data="dailyStatisticData" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
