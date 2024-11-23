<script setup lang="ts">
import WeeklyHeader from "@/views/WeeklyHeader.vue";
import EveryPlans from "@/views/EveryPlans.vue";
</script>

<template>
  <div class="main-page">
    <WeeklyHeader />
    <div class="content">
      <EveryPlans />
    </div>
  </div>
</template>


<style scoped>
/* 전체 페이지 스타일 */
.main-page {
  display: flex;
  flex-direction: column;
}

/* 콘텐츠 영역 (헤더 아래 위치하도록 여백 추가) */
.content {
  margin-top: 80px; /* WeeklyHeader의 높이만큼 여백 */
}
</style>

