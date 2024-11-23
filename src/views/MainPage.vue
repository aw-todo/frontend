<script setup lang="ts">
import WeeklyHeader from "@/views/WeeklyHeader.vue";
import EveryPlans from "@/views/EveryPlans.vue";
import DailyPlans from "@/views/DailyPlans.vue";
</script>

<template>
  <div class="main-page">
    <!-- 헤더 -->
    <WeeklyHeader />
    <div class="content">
      <!-- 왼쪽: 이번 주 계획 -->
      <EveryPlans />
      <!-- 오른쪽: 일별 계획 -->
      <DailyPlans />
    </div>
  </div>
</template>

<style scoped>
/* MainPage 레이아웃 */
.main-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.content {
  display: flex;
  flex: 1; /* 남은 공간 차지 */
  margin-top: 80px; /* 헤더 높이만큼 아래로 밀기 */
  overflow: hidden; /* 넘치는 내용 숨기기 */
}

.content > *:first-child {
  flex: 0 0 20%; /* 왼쪽: EveryPlans는 고정된 너비 (20%) */
  max-width: 20%; /* 최대 너비 제한 */
}

.content > *:last-child {
  flex: 1; /* 오른쪽: DailyPlans가 남은 공간 꽉 채우기 */
}
</style>
