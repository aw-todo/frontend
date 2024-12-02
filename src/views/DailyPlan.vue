<script setup lang="ts">
import { defineProps } from "vue";
import Button from "primevue/button";

const props = defineProps({
  day: String,
  date: Date,
  plans: Array,
  isToday: Boolean,
  addPlan: Function,
});
</script>

<template>
  <div
    class="col d-flex flex-column align-items-center justify-content-start border-left border-right pt-3"
    :class="{ 'today-column': isToday }"
  >
    <span class="day-label mb-1">{{ day }}</span>
    <span class="date-label mb-2">{{ date.getDate() }}일</span>
    <!-- 날짜 밑에 선 추가 -->
    <div class="w-100 border-bottom mb-2"></div>
    <!-- 일정 목록 -->
    <ul class="list-unstyled w-100">
      <li v-for="(plan, idx) in plans" :key="idx" class="text-center py-1 px-2">
        {{ plan }}
      </li>
    </ul>
    <!-- 플랜 추가 버튼 -->
    <Button class="btn btn-sm btn-primary mb-2" @click="addPlan(date)">
      플랜 추가
    </Button>
  </div>
</template>

<style scoped>
.border-left {
  border-left: 1px solid #dee2e6;
}

.border-right {
  border-right: 1px solid #dee2e6;
}

.day-label {
  font-size: 0.9rem;
  color: gray;
  font-weight: bold;
  text-align: center;
}

.date-label {
  font-size: 1.5rem;
  color: black;
  text-align: center;
}

.list-unstyled {
  padding-left: 0;
  list-style: none;
}

.col > ul > li {
  text-align: center;
  padding: 0.5rem 0;
}

.col > ul > li:first-child {
  border-top: none;
}

/* 호버 효과 추가 */
.col:hover {
  background-color: #f9f9f9;
}

/* 오늘 날짜 강조 */
.col.today-column {
  border: 3px solid #535bf2;
}
</style>
