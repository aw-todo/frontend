<script setup lang="ts">
import { computed, defineProps, onMounted, ref } from "vue";
import Button from "primevue/button";
import { DailyPlanType } from "@/type/plan_type.ts";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import ColorPicker from "primevue/colorpicker";
import Select from "primevue/select";
import Checkbox from "primevue/checkbox";
import { usePlanStore } from "@/stores/planStore.ts";
import { PlanService } from "@/service/planService.js";
import { HttpStatusCode } from "@/enum/httpStatusCode.ts";
import { usePlanState } from "@/composables/usePlanState.ts";
import { useToast } from "primevue/usetoast";
import { useDateState } from "@/composables/useDateState.ts";
import { useWeekStore } from "@/stores/weekStore.ts";

const props = defineProps({
  day: String,
  date: Date,
  plans: Array,
  isToday: Boolean,
});

const emits = defineEmits(["update:plans"]);

const planStore = usePlanStore();
const weekStore = useWeekStore();
const toast = useToast();

const currentWeeklyTargets = computed(() => planStore.getCurrentWeeklyTargets);

const { formatBasicDate } = useDateState();

const {
  editDialogVisible,
  deleteDialogVisible,
  selectedTarget,
  editedPlan,
  dialogState,
  dialogHeader,
  openDialog,
  deletePlan,
} = usePlanState();

function hideDialog() {
  selectedTarget.value = {};
}

async function updatePlan() {
  let title;
  if (dialogState.value === "create") {
    title = "추가";
  } else {
    title = "수정";
  }
  if (Object.keys(selectedTarget.value).length === 0) {
    toast.add({
      severity: "warn",
      summary: `플랜 ${title} 실패`,
      detail: `구분을 선택해주세요`,
      life: 3000,
    });
    return;
  }
  if (!editedPlan.value.title.trim()) {
    toast.add({
      severity: "warn",
      summary: `플랜 ${title} 실패`,
      detail: `제목을 작성해주세요.`,
      life: 3000,
    });
    return;
  }

  // text 필드 처리: 값이 없거나 빈 문자열이면 null, 그렇지 않으면 trim된 값
  const trimmedText = editedPlan.value.text ? editedPlan.value.text.trim() : "";
  const finalText = trimmedText === "" ? null : trimmedText;

  const planData = {
    id: editedPlan.value.id,
    title: editedPlan.value.title.trim(),
    text: finalText,
    parent_id: selectedTarget.value.id,
    color: selectedTarget.value.color,
    startDate: formatBasicDate(props.date),
    endDate: formatBasicDate(props.date),
  };
  try {
    if (dialogState.value === "create") {
      const response =
        await PlanService.getInstance().createDailyPlan(planData);
      if (response.status === HttpStatusCode.HTTP_201_CREATED) {
        emits("update:plans");
        weekStore.triggerTargetsFunction();
      } else {
        console.error("API 요청 실패:", response);
      }
    } else if (dialogState.value === "edit") {
      const response =
        await PlanService.getInstance().updateDailyPlan(planData);
      if (response.status === HttpStatusCode.HTTP_200_OK) {
        emits("update:plans");
        weekStore.triggerTargetsFunction();
      } else {
        console.error("API 요청 실패:", response);
      }
    }
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
  }
  editDialogVisible.value = false;

  editedPlan.value.color = "#000000";
}

async function togglePlanDone(plan) {
  const originalDone = !plan.done;
  try {
    const response = await PlanService.getInstance().updatePlanStatus(plan.id);
    console.log(response);
    if (response.status === HttpStatusCode.HTTP_201_CREATED) {
      console.log(`Plan ${plan.id} updated successfully to ${!plan.done}`);
      weekStore.triggerTargetsFunction();
    } else {
      console.error("Failed to update plan, reverting change");
      plan.done = originalDone; // 실패 시 원래 상태로 복구
    }
  } catch (error) {
    console.error("Error updating plan:", error);
    plan.done = originalDone; // 에러 발생 시 원래 상태로 복구
  }
}

async function handleDelete(planId: number) {
  await deletePlan(planId);
  emits("update:plans");
}

// 오늘 날짜를 정규화하여 설정
const today = new Date();
today.setHours(0, 0, 0, 0);

// 플랜 날짜가 오늘보다 이전인지 확인하는 계산 속성
const isPast = computed(() => {
  const planDate = new Date(props.date);
  planDate.setHours(0, 0, 0, 0);
  return planDate < today;
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
      <li
        v-for="(plan, index) in props.plans"
        :key="index"
        class="text-center py-1 px-2 d-flex align-items-center justify-content-between"
      >
        <Checkbox
          v-model="plan.done"
          @change="togglePlanDone(plan)"
          :inputId="'plan' + plan.id"
          binary
        />
        <label :class="{ 'checked-label': plan.done }">{{ plan.title }} </label>
        <button
          class="btn btn-link text-black p-0"
          @click="openDialog('edit', plan)"
        >
          <i class="pi pi-info-circle"></i>
        </button>
      </li>
    </ul>
    <!-- 플랜 추가 버튼 -->
    <Button
      v-if="!isPast"
      class="btn btn-sm btn-primary mb-2"
      @click="openDialog('create')"
    >
      플랜 추가
    </Button>
    <!-- 플랜 추가 다이얼로그 -->
    <Dialog
      v-model:visible="editDialogVisible"
      :header="'플랜 ' + dialogHeader"
      :modal="true"
      @hide="hideDialog"
    >
      <div v-if="currentWeeklyTargets.length > 0" class="p-fluid pb-3">
        <div class="field">
          <label for="plan" class="me-2">구분 :</label>
          <Select v-model="selectedTarget" :options="currentWeeklyTargets">
            <template #value="slotProps">
              <div
                v-if="Object.keys(selectedTarget).length > 0"
                class="d-flex align-items-center justify-content-start"
              >
                <ColorPicker
                  class="me-2"
                  v-model="slotProps.value.color"
                  disabled
                />
                <div>{{ slotProps.value.title }}</div>
              </div>
              <span v-else>상위 목표 설정</span>
            </template>
            <template #option="slotProps">
              <div class="d-flex align-items-center justify-content-start">
                <ColorPicker
                  class="me-2"
                  v-model="slotProps.option.color"
                  disabled
                />
                <div>{{ slotProps.option.title }}</div>
              </div>
            </template>
          </Select>
        </div>
      </div>
      <div class="p-fluid pb-3">
        <div class="field">
          <label for="plan-title" class="me-2">제목 :</label>
          <InputText id="plan-title" v-model="editedPlan.title" />
        </div>
      </div>
      <div class="p-fluid">
        <div class="field">
          <label for="plan-text" class="me-2">내용 :</label>
          <InputText id="plan-text" v-model="editedPlan.text" />
        </div>
      </div>
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

.checked-label {
  text-decoration: line-through;
  color: gray; /* 선택 시 색상 변경 (옵션) */
}

.delete-button {
  background-color: red !important;
  border-color: red !important;
  color: white !important;
}
</style>
