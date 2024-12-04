export interface PlanType {
  title: string;
  text: string;
  startDate: string;
  endDate: string;
  created_at: string;
  priority: string;
  done: boolean;
}

export interface WeeklyTargetType extends PlanType {
  colors: string;
}

export interface DailyPlanType extends PlanType {
  parentPlan: {
    id: number;
    colors: string;
  } | null;
}

// {
//   "id": 1,
//     "title": "회사 프로젝트",
//     "text": "회사에서 진행하는 주요 프로젝트 계획",
//     "startDate": "2024-01-01T00:00:00.000Z",
//     "endDate": "2024-01-31T23:59:59.000Z",
//     "created_at": "2023-11-23T10:00:00.000Z",
//     "priority": "상",
//     "done": false,
//     "parentPlan": null
// }
