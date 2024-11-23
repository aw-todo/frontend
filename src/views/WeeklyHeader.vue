<script setup lang="ts">
import {ref} from "vue";

const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);
const currentWeek = ref(getCurrentWeek());

const goPreviousWeek = () => {
  // Handle previous week logic
  console.log("Go to previous week");
};

const goNextWeek = () => {
  // Handle next week logic
  console.log("Go to next week");
};

// Helper function to calculate the current week of the month
function getCurrentWeek() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return Math.ceil((now.getDate() + startOfMonth.getDay()) / 7);
}
</script>

<template>
  <header class="todo-header">
    <div class="header-navigation">
      <button @click="goPreviousWeek" class="navigation-button">◀</button>
      <h2>{{ currentYear }}년 {{ currentMonth }}월 {{ currentWeek }}주차</h2>
      <button @click="goNextWeek" class="navigation-button">▶</button>
    </div>
    <h1 class="header-title">Weekly TODO</h1>
  </header>
</template>

<style scoped>
.todo-header {
  position: fixed; /* 화면 최상단 고정 */
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* 다른 요소 위에 배치 */
  background-color: #ffffff; /* 배경색: 하얀색 */
  color: #000000; /* 글자색: 검은색 */
  border-bottom: 1px solid #ddd;
  padding: 16px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.header-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px; /* 버튼과 텍스트 간격 */
}

.header-navigation h2 {
  margin: 0;
  font-size: 18px;
  font-weight: normal;
  color: #000000; /* 글자색: 검은색 */
}

.navigation-button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #000000; /* 글자색: 검은색 */
}

.header-title {
  font-size: 40px;
  font-weight: bold;
  margin: 16px 0 0; /* 제목과 네비게이션 사이 간격 */
  padding-bottom: 16px;
  color: #000000; /* 글자색: 검은색 */
}

.statistics-button {
  background-color: #f3f3f3; /* 버튼 배경색 */
  color: #000000; /* 글자색: 검은색 */
  border: 1px solid #ccc; /* 버튼 테두리 */
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  position: absolute;
  top: 16px;
  right: 16px; /* 헤더 오른쪽 상단에 위치 */
}
</style>