<script setup lang="ts">
import { computed } from "vue";
import { Bar } from "vue-chartjs";

const props = defineProps({
  data: Array,
});

const weekend = ["일", "월", "화", "수", "목", "금", "토"];

const chartData = computed(() => {
  return {
    labels: props.data.map((item, index) => `${item.date} (${weekend[index]})`),
    datasets: [
      {
        label: "완료 비율(%)",
        backgroundColor: "#10B981", // 예: Vue 테마 컬러
        data: props.data.map((item) => item.ratio),
      },
    ],
  };
});

// 차트 옵션
const chartOptions = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      stepSize: 1,
      min: 0,
      max: 100,
    },
  },
};
</script>

<template>
  <Bar id="daily-done-ratio" :options="chartOptions" :data="chartData" />
</template>

<style scoped></style>
