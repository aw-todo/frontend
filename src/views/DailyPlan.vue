<script setup lang="ts">
import { defineProps, onMounted, ref } from "vue";
import Button from "primevue/button";
import { DailyPlanType } from "@/type/plan_type.ts";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";

const props = defineProps({
  day: String,
  date: Date,
  plans: Array,
  isToday: Boolean,
});

const dailyPlans = ref<DailyPlanType[]>([]);

// 플랜 추가 함수
const dialogVisible = ref(false);
const newPlan = ref("");
let selectedDate = null;

function addPlan(date) {
  selectedDate = date;
  newPlan.value = "";
  dialogVisible.value = true;
}

function confirmAddPlan() {
  if (newPlan.value.trim()) {
    dailyPlans.value[selectedDate.toDateString()].push(newPlan.value.trim());
  }
  dialogVisible.value = false;
}

onMounted(() => {
  dailyPlans.value = props.plans;
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
    <!-- 플랜 추가 다이얼로그 -->
    <Dialog v-model:visible="dialogVisible" header="계획 추가" :modal="true">
      <div class="p-fluid">
        <div class="field">
          <label for="plan" class="me-2">내용</label>
          <InputText id="plan" v-model="newPlan" />
        </div>
      </div>
      <template #footer>
        <Button label="추가" icon="pi pi-check" @click="confirmAddPlan" />
      </template>
    </Dialog>
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
