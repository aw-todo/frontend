<script setup lang="ts">
import WeeklyHeader from "@/views/WeeklyHeader.vue";
import EveryPlans from "@/views/EveryPlans.vue";
import DailyPlans from "@/views/DailyPlans.vue";
</script>

<template>
  <div class="container-fluid vh-100 d-flex flex-column">
    <!-- 헤더 -->
    <WeeklyHeader />
    <div class="row flex-grow-1 overflow-hidden mt-3">
      <!-- 왼쪽: 이번 주 계획 -->
      <div class="col-2 p-0 overflow-auto">
        <EveryPlans />
      </div>
      <div class="col-10 p-0 overflow-auto">
        <!-- 오른쪽: 일별 계획 -->
        <DailyPlans />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
