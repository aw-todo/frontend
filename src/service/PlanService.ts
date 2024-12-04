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

  async createDailyPlan(planData: any) {
    const url = `/plan`;
    const data = {
      title: planData.title,
      text: planData.text,
      startDate: planData.startDate,
      endDate: planData.endDate,
      color: planData.color,
      parentPlan: planData.parent_id,
    };
    return apiClient.post(url, data);
  }

  async createWeeklyPlan(planData: any) {
    const url = `/plan`;
    const data = {
      title: planData.title,
      text: planData.text,
      color: planData.color,
      startDate: planData.startDate,
      endDate: planData.endDate,
      parentPlan: null,
    };
    return apiClient.post(url, data);
  }

  async getWeeklyPlans(startDate: string, endDate: string) {
    const url = "/plan/parent";
    const data = {
      params: {
        startDate: startDate,
        endDate: endDate,
      },
    };
    return apiClient.get(url, data);
  }

  async getDailyPlans(startDate: string, endDate: string) {
    const url = "/plan/child";
    const data = {
      params: {
        startDate: startDate,
        endDate: endDate,
      },
      headers: { "Cache-Control": "no-cache" },
    };
    return apiClient.get(url, data);
  }

  async updatePlanStatus(planId: number) {
    const url = `/plan/toggle-done`;
    const data = {
      id: planId,
    };
    return apiClient.post(url, data);
  }

  async updateDailyPlan(planData: any) {
    const url = `/plan/child`;
    const data = {
      id: planData.id,
      title: planData.title,
      text: planData.text,
      parent: planData.parent_id,
    };
    return apiClient.put(url, data);
  }

  async updateWeeklyPlan(planData: any) {
    const url = `/plan/parent`;
    const data = {
      id: planData.id,
      title: planData.title,
      text: planData.text,
      color: planData.color,
    };
    return apiClient.put(url, data);
  }

  async deletePlan(planId: number) {
    const url = `/plan/${planId}`;
    return apiClient.delete(url);
  }
}
