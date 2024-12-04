import { apiClient } from "./apiClients.ts";

export class PlanService {
  private static instance: PlanService;

  constructor() {}

  // 싱글톤 인스턴스를 반환하는 메서드
  public static getInstance(): PlanService {
    if (!PlanService.instance) {
      PlanService.instance = new PlanService();
    }
    return PlanService.instance;
  }

  async getPlans(startDate: string, endDate: string) {
    const data = {
      params: {
        startDate: startDate,
        endDate: endDate,
      },
    };
    const url = "/plans";
    return apiClient.get(url, data);
  }

  async updatePlanStatus(planId: number, done: boolean) {
    const url = `/plans/change/status`;
    const data = {
      planId: planId,
      done: done,
    };
    return apiClient.post(url, data);
  }
}
