export interface PlanType {
  color: string;
  content: string;
}

export interface WeeklyPlanType extends PlanType {
  childPlans: PlanType[] | null;
}

export interface DailyPlanType extends PlanType {
  parentPlans: number | null;
}
