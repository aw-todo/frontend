<script setup lang="ts">
import { computed } from "vue";
import { Pie } from "vue-chartjs";

const props = defineProps({
  data: Object,
});

const chartData = computed(() => {
  return {
    labels: ["완료", "미 완료"],
    datasets: [
      {
        label: "계획 달성 수",
        backgroundColor: ["#047857", "#A7F3D0"], // 예: Vue 테마 컬러
        data: [props.data.done, props.data.notDone],
      },
    ],
  };
});

// 차트 옵션
const chartOptions = {
  responsive: true,
};
</script>

<template>
  <Pie id="weekly-done-ratio" :options="chartOptions" :data="chartData" />
</template>

<style scoped></style>
