export interface PlanType {
  content: string;
}

export interface WeeklyPlanType extends PlanType {
  colors: string;
  childPlans: PlanType[] | null;
}

export interface DailyPlanType extends PlanType {
  parentPlan: {
    id: number;
    colors: string;
  } | null;
}
