import { apiClient } from "./apiClients.ts";
import { PlanType } from "../type/plan_type.ts";

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
    const url = "/plan";
    return apiClient.get(url, data);
  }

  async updatePlanStatus(planId: number) {
    const url = `/plan/change/status`;
    const data = {
      planId: planId,
    };
    return apiClient.post(url, data);
  }

  async createNewPlan(planData: any) {
    const url = `/plan/create`;
    const data = {
      title: planData.title,
      text: planData.text,
      parent_id: planData.parent_id,
    };
    return apiClient.post(url, data);
  }

  async updatePlan(planData: any) {
    const url = `/plan/update`;
    const data = {
      title: planData.title,
      text: planData.text,
      parent_id: planData.parent_id,
    };
    return apiClient.post(url, data);
  }

  getPlansMock(startDate: string, endDate: string) {
    const data = [
      {
        id: 1,
        title: "회사 프로젝트1",
        text: "회사에서 진행하는 주요 프로젝트 계획",
        startDate: "2024-12-01T00:00:00.000Z",
        endDate: null,
        created_at: "2024-12-02T00:00:00.000Z",
        priority: "상",
        done: false,
        parentPlan: null,
      },
      {
        id: 2,
        title: "회사 프로젝트2",
        text: "회사에서 진행하는 주요 프로젝트 계획",
        startDate: "2024-12-02T00:00:00.000Z",
        endDate: null,
        created_at: "2024-12-02T00:00:00.000Z",
        priority: "상",
        done: false,
        parentPlan: null,
      },
      {
        id: 3,
        title: "회사 프로젝트23",
        text: "회사에서 진행하는 주요 프로젝트 계획",
        startDate: "2024-12-03T00:00:00.000Z",
        endDate: null,
        created_at: "2024-12-03T00:00:00.000Z",
        priority: "상",
        done: false,
        parentPlan: null,
      },
      {
        id: 4,
        title: "회사 프로젝트24",
        text: "회사에서 진행하는 주요 프로젝트 계획",
        startDate: "2024-12-02T00:00:00.000Z",
        endDate: null,
        created_at: "2024-12-02T00:00:00.000Z",
        priority: "상",
        done: false,
        parentPlan: null,
      },
      {
        id: 5,
        title: "회사 프로젝트25",
        text: "회사에서 진행하는 주요 프로젝트 계획",
        startDate: "2024-12-06T00:00:00.000Z",
        endDate: null,
        created_at: "2024-12-06T00:00:00.000Z",
        priority: "상",
        done: false,
        parentPlan: null,
      },
    ];
    return data;
  }

  updatePlanStatusMock(planId: number, done: boolean) {
    return 200;
  }
}
