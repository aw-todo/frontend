export interface PlanType {
  id: number;
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
