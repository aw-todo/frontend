<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import { useWeekStore } from "@/stores/weekStore.ts";

const divStyle = {
  height: "80vh",
  overflowY: "auto",
};

const weekStore = useWeekStore();

// 현재 날짜 및 주차 정보 가져오기
const currentDate = computed(() => weekStore.currentDate);

// 요일 배열
const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

// 주의 시작일 계산 (일요일 기준)
const startOfWeek = computed(() => {
  const date = new Date(currentDate.value);
  date.setDate(date.getDate() - date.getDay());
  return date;
});

// 요일별 날짜 매핑
const datesOfWeek = computed(() => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek.value);
    date.setDate(startOfWeek.value.getDate() + i);
    dates.push(date);
  }
  return dates;
});

// 일정 데이터 초기화
const plans = reactive({});

// 각 날짜별로 일정 배열 초기화
function initializePlans() {
  datesOfWeek.value.forEach((date) => {
    const key = date.toDateString();
    if (!plans[key]) {
      plans[key] = []; // 초기화
    }
  });
}

// 플랜 추가 함수
const addPlan = (date) => {
  const plan = prompt(
    `${date.getMonth() + 1}월 ${date.getDate()}일의 플랜을 입력하세요:`,
  );
  if (plan) {
    plans[date.toDateString()].push(plan);
  }
};

const dialogVisible = ref(false);
const newPlan = ref("");
let selectedDate = null;

function openDialog(date) {
  selectedDate = date;
  newPlan.value = "";
  dialogVisible.value = true;
}

function confirmAddPlan() {
  if (newPlan.value.trim()) {
    plans[selectedDate.toDateString()].push(newPlan.value.trim());
  }
  dialogVisible.value = false;
}

onMounted(() => {
  // 컴포넌트가 마운트될 때 초기화
  initializePlans();
});

// 주차 정보 변경 시 업데이트
watch(
  () => weekStore.currentDate,
  () => {
    initializePlans();
  },
);

// 오늘 날짜 계산
const today = computed(() => new Date());
</script>

<template>
  <div :style="divStyle">
    <div class="row h-100 no-gutters">
      <div
        class="col d-flex flex-column align-items-center justify-content-start border-left border-right"
        v-for="(day, index) in daysOfWeek"
        :key="index"
        :class="{
          'today-column':
            datesOfWeek[index].toDateString() === today.toDateString(),
        }"
      >
        <span class="day-label mb-1">{{ day }}</span>
        <span class="date-label mb-2"
          >{{ datesOfWeek[index].getDate() }}일</span
        >
        <!-- 날짜 밑에 선 추가 -->
        <div class="w-100 border-bottom mb-2"></div>
        <!-- 일정 목록 -->
        <ul class="list-unstyled w-100">
          <li
            v-for="(plan, idx) in plans[datesOfWeek[index].toDateString()]"
            :key="idx"
            class="text-center py-1 px-2"
          >
            {{ plan }}
          </li>
        </ul>
        <!-- 플랜 추가 버튼 -->
        <Button
          class="btn btn-sm btn-primary mb-2"
          @click="addPlan(datesOfWeek[index])"
        >
          플랜 추가
        </Button>
      </div>
    </div>
    <Dialog v-model:visible="dialogVisible" header="계획 추가">
      <div class="p-fluid">
        <div class="field">
          <label for="plan">플랜 내용</label>
          <InputText id="plan" v-model="newPlan" />
        </div>
      </div>
      <template #footer>
        <Button
          label="취소"
          icon="pi pi-times"
          @click="dialogVisible = false"
          class="p-button-text"
        />
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

.row.no-gutters {
  margin-right: 0;
  margin-left: 0;
}

.row.no-gutters > [class*="col-"] {
  padding-right: 0;
  padding-left: 0;
}

.list-unstyled {
  padding-left: 0;
  list-style: none;
}

.col {
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
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
  border: 3px solid #007bff;
}
</style>
