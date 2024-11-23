<script setup lang="ts">
import WeeklyHeader from "@/views/MainPage/components/WeeklyHeader.vue";
</script>

<template>
    <WeeklyHeader />
</template>

<style scoped>
/* MainPage 전체 레이아웃 */
.main-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden; /* 화면 높이를 넘지 않도록 */
}

/* 콘텐츠 영역 (헤더 아래에서 시작) */
.content {
  display: flex;
  flex: 1; /* 남은 공간을 차지 */
  margin-top: 80px; /* 헤더 높이와 일치 */
}
</style>
