<script setup lang="ts">
import MainHeader from "@/views/MainHeader.vue";
import WeeklyTargets from "@/views/WeeklyTargets.vue";
import WeeklyPlans from "@/views/WeeklyPlans.vue";
</script>

<template>
  <div class="container-fluid p-0">
    <MainHeader />
    <div class="row no-gutters">
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
  </div>
</template>

<style scoped></style>
