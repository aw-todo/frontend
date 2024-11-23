<script setup lang="ts">
import { ref } from "vue";
import { useConfirm } from "primevue/useconfirm";
import CreatePlan from "@/views/CreatePlan.vue";
import {Button} from "primevue";
import {ConfirmDialog} from "primevue";

// 큰 단위 계획 리스트
const bigPlans = ref([
  { id: 1, text: "예시 계획 1", done: false },
  { id: 2, text: "예시 계획 2", done: true },
]);


const confirm = useConfirm();

// CreatePlan 표시
const showCreatePlanDialog = () => {
  confirm.require({
    group: "create-plan",
    header: "새로운 계획 생성",
    icon: "pi pi-pencil",
    accept: () => {
      console.log("Plan saved!"); // 계획 저장 로직 추가
    },
    reject: () => {
      console.log("Plan creation cancelled");
    },
  });
};
// 계획 완료 상태 토글
const togglePlanDone = (id: number) => {
  const plan = bigPlans.value.find((plan) => plan.id === id);
  if (plan) {
    plan.done = !plan.done;
  }
};
</script>

<template>
  <aside class="big-plans">
    <h2 class="section-title">이번 주 계획</h2>
    <ul class="plan-list">
      <li
          v-for="plan in bigPlans"
          :key="plan.id"
          class="plan-item"
          :class="{ done: plan.done }"
      >
        <label>
          <input
              type="checkbox"
              v-model="plan.done"
              @change="togglePlanDone(plan.id)"
          />
          {{ plan.text }}
        </label>
      </li>
    </ul>
    <Button @click="showCreatePlanDialog" label="계획 추가"></Button>
    <ConfirmDialog group="create-plan">
      <template #message>
        <!-- CreatePlan 컴포넌트를 여기 렌더링 -->
        <CreatePlan />
      </template>
    </ConfirmDialog>
  </aside>
</template>

<style scoped>
/* 큰 단위 계획 섹션 */
.big-plans {
  position: fixed; /* 화면 왼쪽에 고정 */
  top: 150px; /* 헤더 높이 */
  left: 0;
  width: 20%; /* 화면 너비의 20% 차지 */
  height: calc(100vh - 80px); /* 헤더 제외한 화면 높이 */
  background-color: #f9f9f9;
  border-right: 1px solid #ddd;
  padding: 16px;
  box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto; /* 내용이 넘칠 경우 스크롤 */
}

/* 섹션 제목 */
.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
}

/* 계획 리스트 스타일 */
.plan-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.plan-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 16px;
  color: #333;
}

.plan-item.done {
  text-decoration: line-through;
  color: #999; /* 완료된 항목은 흐리게 표시 */
}

.plan-item input[type="checkbox"] {
  margin-right: 8px;
}

/* 계획 추가 버튼 */
.add-plan-button {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #6c63ff;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  margin-top: 16px;
}

.add-plan-button:hover {
  background-color: #5750d3; /* 버튼 호버 효과 */
}
</style>
