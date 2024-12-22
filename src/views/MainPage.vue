<script setup lang="ts">
import MainHeader from "@/views/MainHeader.vue";
import WeeklyTargets from "@/views/WeeklyTargets.vue";
import WeeklyPlans from "@/views/WeeklyPlans.vue";
import { useModeStore } from "@/stores/modeStore.ts";
import { computed } from "vue";
import WeeklyStatistic from "@/views/PlanStatistic.vue";

const modeStore = useModeStore();

const currentViewMode = computed(() => modeStore.getCurrentViewMode);
</script>

<template>
  <div class="container-fluid p-0">
    <MainHeader />
    <div v-if="currentViewMode === 'plan-view'" class="row no-gutters">
      <div class="col-12 d-md-none">
        <!-- 작은 화면에서는 EveryPlans와 DailyPlans를 순서대로 세로로 배치 -->
        <WeeklyTargets />
        <WeeklyPlans />
      </div>
      <div class="d-none d-md-flex w-100">
        <!-- 중간 화면부터는 가로로 배치 -->
        <WeeklyTargets class="col-md-2" />
        <WeeklyPlans class="col-md-10" />
      </div>
    </div>
    <div
      v-else-if="currentViewMode === 'statistic-view'"
      class="row no-gutters"
    >
      <div class="col-12 d-md-none">
        <!-- 작은 화면에서는 EveryPlans와 DailyPlans를 순서대로 세로로 배치 -->
        <WeeklyStatistic />
      </div>
      <div class="d-none d-md-flex w-100">
        <!-- 중간 화면부터는 가로로 배치 -->
        <WeeklyStatistic class="col-md-2" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
