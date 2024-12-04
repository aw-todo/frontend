import { computed } from "vue";
import { useWeekStore } from "../stores/weekStore.ts";

export function useDateState() {
  const weekStore = useWeekStore();

  // 현재 날짜 및 주차 정보 가져오기
  const currentDate = computed(() => weekStore.currentDate);

  // 주의 시작일 계산 (일요일 기준)
  const startOfWeek = computed(() => {
    const date = new Date(currentDate.value);
    date.setDate(date.getDate() - date.getDay());
    return date;
  });

  const startDate = computed(() => {
    return formatDate(startOfWeek.value);
  });

  const endDate = computed(() => {
    const endOfWeekDate = new Date(startOfWeek.value);
    endOfWeekDate.setDate(endOfWeekDate.getDate() + 6); // 주의 마지막 날 계산
    return formatDate(endOfWeekDate);
  });

  function formatDate(date) {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 +1
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  function formatBasicDate(date) {
    const tmp_date = new Date(date);

    // 연, 월, 일을 추출하고 두 자리로 맞추기
    const year = tmp_date.getFullYear();
    const month = String(tmp_date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
    const day = String(tmp_date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return {
    weekStore,
    startOfWeek,
    startDate,
    endDate,
    formatBasicDate,
  };
}
