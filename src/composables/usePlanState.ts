import { computed, ref } from "vue";
import { WeeklyTargetType } from "../type/plan_type.ts";

export function usePlanState() {
  const editDialogVisible = ref(false);
  const editedTitle = ref("");
  const editedText = ref("");
  const editedColor = ref("#000000");
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

  function openDialog(
    state: string,
    plan: WeeklyTargetType | null = null,
    index: number | null = null,
  ) {
    dialogState.value = state;
    if (state === "create") {
      editedTitle.value = "";
      editedText.value = "";
      editedColor.value = "#000000";
      editedIndex.value = null;
    } else if (state === "edit") {
      editedTitle.value = plan.title;
      editedText.value = plan.text;
      editedColor.value = plan.color || "#000000";
      editedIndex.value = index;
    }
    editDialogVisible.value = true;
  }
  return {
    editDialogVisible,
    editedTitle,
    editedText,
    editedColor,
    editedIndex,
    dialogState,
    dialogHeader,
    openDialog,
  };
}
