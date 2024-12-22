<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import ColorPicker from "primevue/colorpicker";
import { WeeklyTargetType } from "@/type/plan_type.ts";
import { usePlanStore } from "@/stores/planStore.ts";
import { usePlanState } from "@/composables/usePlanState.ts";
import { PlanService } from "@/service/planService.js";
import { HttpStatusCode } from "@/enum/httpStatusCode.ts";
import { useDateState } from "@/composables/useDateState.ts";
import { useToast } from "primevue/usetoast";

const divStyle = {
  minHeight: "30vh",
  maxHeight: "50vh",
};

const planStore = usePlanStore();
const { weekStore, startDate, endDate } = useDateState();
const toast = useToast();

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

const weeklyPlans = ref<WeeklyTargetType[]>([]);

// const childrenPlans = ref<WeeklyTargetType[]>([]);

const {
  editDialogVisible,
  deleteDialogVisible,
  editedPlan,
  dialogState,
  dialogHeader,
  openDialog,
  deletePlan,
} = usePlanState();

async function fetchPlans() {
  weeklyPlans.value = (
    await PlanService.getInstance().getWeeklyPlans(
      startDate.value,
      endDate.value,
    )
  ).data;
  planStore.setCurrentWeeklyTargets(weeklyPlans.value);
  console.log(weeklyPlans.value);
}

async function updatePlan() {
  // 플랜 제목 설정
  const titleAction = dialogState.value === "create" ? "추가" : "수정";

  // 제목 유효성 검사
  if (!editedPlan.value.title.trim()) {
    toast.add({
      severity: "warn",
      summary: `플랜 ${titleAction} 실패`,
      detail: `제목을 작성해주세요.`,
      life: 3000,
    });
    return;
  }

  const trimmedText = editedPlan.value.text ? editedPlan.value.text.trim() : "";
  const finalText = trimmedText === "" ? null : trimmedText;

  // 플랜 데이터 준비
  const planData = {
    id: editedPlan.value.id,
    title: editedPlan.value.title.trim(),
    text: finalText,
    color: editedPlan.value.color,
    startDate: startDate.value,
    endDate: endDate.value,
  };

  // API 함수와 성공 상태 코드 결정
  const isCreate = dialogState.value === "create";
  const apiFunction = isCreate
    ? PlanService.getInstance().createWeeklyPlan
    : PlanService.getInstance().updateWeeklyPlan;
  const successStatus = isCreate
    ? HttpStatusCode.HTTP_201_CREATED
    : HttpStatusCode.HTTP_200_OK;
  const successMessage = isCreate ? "추가" : "수정";
  const failureMessage = isCreate ? "추가" : "수정";

  try {
    // API 호출
    const response = await apiFunction(planData);

    // 성공 여부 확인
    if (response.status === successStatus) {
      // 성공 처리
      await fetchPlans();
      editDialogVisible.value = false;
      toast.add({
        severity: "success",
        summary: `플랜 ${successMessage} 성공`,
        detail: `플랜이 성공적으로 ${successMessage}되었습니다.`,
        life: 3000,
      });
      weekStore.triggerPlansFunction();
    } else {
      // 실패 처리
      toast.add({
        severity: "error",
        summary: `플랜 ${failureMessage} 실패`,
        detail: `서버 응답 코드: ${response.status}`,
        life: 3000,
      });
      console.error("API 요청 실패:", response);
    }
  } catch (error) {
    // 예외 처리
    toast.add({
      severity: "error",
      summary: `플랜 ${failureMessage} 중 오류`,
      detail: error.message || "알 수 없는 오류가 발생했습니다.",
      life: 3000,
    });
    console.error("API 요청 중 오류 발생:", error);
  } finally {
    // 항상 실행되는 코드
    editedPlan.value.color = "#000000";
  }
}

async function handleDelete(planId: number) {
  await deletePlan(planId);
  await fetchPlans();
  weekStore.triggerPlansFunction();
}

onMounted(async () => {
  await fetchPlans();
});

watch(currentWeek, async () => {
  await fetchPlans();
});

watch(
  () => weekStore.triggerForWeeklyTargets,
  async (newVal) => {
    if (newVal) {
      await fetchPlans();
      weekStore.resetTargetTrigger();
    }
  },
);
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
        v-for="(plan, index) in weeklyPlans"
        :key="index"
      >
        <ColorPicker v-model="plan.color" disabled />
        <label :class="{ 'checked-label': plan.done }">{{ plan.title }} </label>
        <label :class="{ 'checked-label': plan.done }"
          >({{ plan.completedChildren }}/{{ plan.totalChildren }})</label
        >
        <button
          class="btn btn-link text-black p-0"
          @click="openDialog('edit', plan)"
        >
          <i class="pi pi-info-circle"></i>
        </button>
      </li>
    </ul>

    <!-- 플랜 수정 모달 -->
    <Dialog
      :header="'플랜 ' + dialogHeader"
      v-model:visible="editDialogVisible"
      :modal="true"
    >
      <div class="p-fluid pb-3">
        <div class="field">
          <label for="color" class="me-2">구분 :</label>
          <ColorPicker v-model="editedPlan.color" />
        </div>
      </div>
      <div class="p-fluid pb-3">
        <div class="field">
          <label for="title" class="me-2">제목 :</label>
          <InputText id="title" v-model="editedPlan.title" />
        </div>
      </div>
      <div class="p-fluid pb-3">
        <div class="field">
          <label for="content" class="me-2">내용 :</label>
          <InputText id="content" v-model="editedPlan.text" />
        </div>
      </div>
      <!--      <div class="p-fluid">-->
      <!--        <div class="field">-->
      <!--          <label for="plan" class="me-2">하위 플랜</label>-->
      <!--          <InputText id="plan" v-model="childrenPlans" />-->
      <!--        </div>-->
      <!--      </div>-->
      <template #footer>
        <Button
          v-if="dialogState === 'create'"
          label="저장"
          icon="pi pi-check"
          @click="updatePlan"
        />
        <div v-else>
          <Button
            class="delete-button me-2"
            label="삭제"
            icon="pi pi-check"
            @click="deleteDialogVisible = true"
          />
          <Button label="수정" icon="pi pi-check" @click="updatePlan" />
        </div>
      </template>
    </Dialog>
    <Dialog
      header="플랜 삭제"
      v-model:visible="deleteDialogVisible"
      :modal="true"
    >
      <div class="p-fluid pb-3">
        <div class="field">
          <label for="content" class="me-2"
            >해당 플랜 삭제 시, 관련되어 있는 하위 목표들이 함께
            삭제됩니다.</label
          >
        </div>
      </div>
      <template #footer>
        <Button
          class="me-2"
          label="취소"
          icon="pi pi-check"
          @click="deleteDialogVisible = false"
        />
        <Button
          class="delete-button"
          label="삭제"
          icon="pi pi-check"
          @click="handleDelete(editedPlan.id)"
        />
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

.delete-button {
  background-color: red !important;
  border-color: red !important;
  color: white !important;
}

.checked-label {
  text-decoration: line-through;
  color: gray; /* 선택 시 색상 변경 (옵션) */
}
</style>
