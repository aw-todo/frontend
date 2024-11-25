<script setup lang="ts">
const divStyle = {
  minHeight: "30vh",
  maxHeight: "50vh",
};
</script>

<template>
  <div class="bg-light p-3 overflow-auto" :style="divStyle">
    <p>Every Plans</p>
    <!-- 예시로 긴 내용 추가 -->
    <p v-for="i in 20" :key="i">Plan {{ i }}</p>
  </div>
</template>

<style scoped></style>
