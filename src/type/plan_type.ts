export interface PlanType {
  content: string;
}

export interface WeeklyTargetType extends PlanType {
  colors: string;
  childPlans: PlanType[] | null;
}

export interface DailyPlanType extends PlanType {
  parentPlan: {
    id: number;
    colors: string;
  } | null;
}
