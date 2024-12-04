export interface PlanType {
  id: number;
  title: string;
  text: string;
  startDate: string;
  endDate: string;
  color: string;
  created_at: string;
  priority: string;
  done: boolean;
  parentPlan: PlanType;
}

export interface WeeklyTargetType extends PlanType {}

export interface DailyPlanType extends PlanType {}
