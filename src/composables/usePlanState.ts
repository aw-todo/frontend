import { computed, ref } from "vue";
import { WeeklyTargetType } from "../type/plan_type.ts";
import { PlanService } from "../service/PlanService.ts";
import { HttpStatusCode } from "../enum/httpStatusCode.ts";
import { useToast } from "primevue/usetoast";
import { useWeekStore } from "../stores/weekStore.ts";

export function usePlanState() {
  const weekStore = useWeekStore();
  const toast = useToast();
  const editDialogVisible = ref(false);
  const deleteDialogVisible = ref(false);
  const editedColor = ref("#000000");

  const editedPlan = ref<WeeklyTargetType>({});
  const selectedTarget = ref<WeeklyTargetType>({});

  const dialogState = ref("");
  const dialogHeader = computed(() => {
    if (dialogState.value === "create") {
      return "추가";
    } else if (dialogState.value === "edit") {
      return "정보";
    }
    return "";
  });

  function openDialog(state: string, plan: WeeklyTargetType | null = null) {
    dialogState.value = state;
    if (state === "create") {
      selectedTarget.value = {};
      editedPlan.value.title = "";
      editedPlan.value.text = "";
      editedPlan.value.color =
        "#" + Math.floor(Math.random() * 16777215).toString(16);
    } else if (state === "edit") {
      selectedTarget.value = plan.parentPlan;
      editedPlan.value.id = plan.id;
      editedPlan.value.title = plan.title;
      editedPlan.value.text = plan.text;
      editedPlan.value.color = plan.color;
    }
    editDialogVisible.value = true;
  }

  async function deletePlan(planId: number) {
    const response = await PlanService.getInstance().deletePlan(planId);

    if (response.status === HttpStatusCode.HTTP_200_OK) {
      deleteDialogVisible.value = false;
      editDialogVisible.value = false;
      toast.add({
        severity: "contrast",
        summary: "플랜 삭제",
        detail: "플랜이 삭제되었습니다.",
        life: 3000,
      });
      weekStore.triggerTargetsFunction();
    } else {
      deleteDialogVisible.value = false;
      toast.add({
        severity: "error",
        summary: "플랜 삭제",
        detail: "플랜 삭제에 실패하였습니다.",
        life: 3000,
      });
    }
  }

  return {
    editDialogVisible,
    deleteDialogVisible,
    selectedTarget,
    editedColor,
    editedPlan,
    dialogState,
    dialogHeader,
    openDialog,
    deletePlan,
  };
}
