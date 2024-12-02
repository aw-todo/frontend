<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useWeekStore } from "@/stores/weekStore.ts";

import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import ColorPicker from "primevue/colorpicker";
import { WeeklyPlanType } from "@/type/plan_type.ts";

const divStyle = {
  minHeight: "30vh",
  maxHeight: "50vh",
};

const weekStore = useWeekStore();

// 현재 주차 정보 가져오기
const currentDate = computed(() => weekStore.currentDate);

const currentMonth = computed(() => currentDate.value.getMonth() + 1);
const currentWeek = computed(() => {
  return getWeekNumberInMonth(currentDate.value);
});

// 주차 계산 함수
function getWeekNumberInMonth(date) {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfMonth = date.getDate();
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0: 일요일, ..., 6: 토요일

  // 첫 주의 남은 일수 계산
  const firstWeekRemainingDays = 7 - startDayOfWeek;

  if (dayOfMonth <= firstWeekRemainingDays) {
    return 1;
  } else {
    return Math.ceil((dayOfMonth - firstWeekRemainingDays) / 7) + 1;
  }
}

const everyPlans = ref<WeeklyPlanType>([]);

const editDialogVisible = ref(false);
const editedColor = ref("#000000");
const editedContent = ref("");
const editedIndex = ref(null);
const dialogState = ref("");
const dialogHeader = computed(() => {
  if (dialogState.value === "create") {
    return "플랜 추가";
  } else if (dialogState.value === "edit") {
    return "플랜 정보";
  }
  return "";
});

const childrenPlans = ref<WeeklyPlanType[]>([]);

function openDialog(
  state: string,
  plan: WeeklyPlanType | null = null,
  index: number | null = null,
) {
  dialogState.value = state;
  if (state === "create") {
    editedContent.value = null;
    editedColor.value = "#000000";
    editedIndex.value = null;
  } else if (state === "edit") {
    editedContent.value = plan.content;
    editedColor.value = plan.color || "#000000";
    editedIndex.value = index;
  }
  editDialogVisible.value = true;
}

function updatePlan() {
  if (editedContent.value.trim()) {
    const planData = {
      content: editedContent.value.trim(),
      color: editedColor.value,
    };
    if (dialogState.value === "create") {
      // 맨 위에 새로운 플랜 추가
      everyPlans.value.push(planData);
    } else if (dialogState.value === "edit") {
      // 해당 인덱스의 플랜 수정
      everyPlans.value.splice(editedIndex.value, 1, planData);
    }
    editDialogVisible.value = false;
  } else {
  }
  editedColor.value = "#000000";
}

onMounted(() => {
  everyPlans.value = [
    { color: "#003213", content: "hi" },
    { color: "#633213", content: "im" },
  ];
});

watch(currentWeek, () => {
  everyPlans.value = [
    { color: "#633213", content: "im" },
    { color: "#003213", content: "yonghan" },
  ];
});
</script>

<template>
  <div
    class="bg-light p-3 overflow-auto every-plans-container"
    :style="divStyle"
  >
    <!-- 제목과 버튼을 한 줄에 배치 -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <p class="h5 mb-0">{{ currentMonth }}월 {{ currentWeek }}주차 목표</p>
      <button class="btn btn-link text-black p-0" @click="openDialog('create')">
        <i class="pi pi-plus-circle"></i>
      </button>
    </div>

    <!-- 플랜 리스트 -->
    <ul class="list-group">
      <li
        class="list-group-item d-flex justify-content-between align-items-center"
        v-for="(plan, index) in everyPlans"
        :key="index"
      >
        <ColorPicker v-model="plan.color" disabled />
        {{ plan.content }}
        <button
          class="btn btn-link text-black p-0"
          @click="openDialog('edit', plan, index)"
        >
          <i class="pi pi-info-circle"></i>
        </button>
      </li>
    </ul>

    <!-- 플랜 수정 모달 -->
    <Dialog
      :header="dialogHeader"
      v-model:visible="editDialogVisible"
      :modal="true"
    >
      <div class="p-fluid pb-3">
        <div class="field">
          <label for="color" class="me-2">구분 :</label>
          <ColorPicker v-model="editedColor" />
        </div>
      </div>
      <div class="p-fluid pb-3">
        <div class="field">
          <label for="content" class="me-2">내용 :</label>
          <InputText id="content" v-model="editedContent" autofocus />
        </div>
      </div>
      <div class="p-fluid">
        <div class="field">
          <label for="plan" class="me-2">하위 플랜</label>
          <InputText id="plan" v-model="childrenPlans" autofocus />
        </div>
      </div>
      <template #footer>
        <Button
          v-if="dialogState === 'create'"
          label="저장"
          icon="pi pi-check"
          @click="updatePlan"
        />
        <Button v-else label="수정" icon="pi pi-check" @click="updatePlan" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.every-plans-container {
  border: 2px solid #dee2e6;
  border-radius: 10px;
  transition: box-shadow 0.5s;
}

.every-plans-container:hover {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}
</style>
