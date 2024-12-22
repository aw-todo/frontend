import { apiClient } from "./apiClients.ts";

export class StatisticService {
  private static instance: StatisticService;

  constructor() {}

  // 싱글톤 인스턴스를 반환하는 메서드
  public static getInstance(): StatisticService {
    if (!StatisticService.instance) {
      StatisticService.instance = new StatisticService();
    }
    return StatisticService.instance;
  }

  async getDailyStatistic(startDate: string, endDate: string) {
    const url = `/statistics/daily`;
    const data = {
      params: {
        startDate: startDate,
        endDate: endDate,
      },
    };
    return apiClient.get(url, data);
  }

  async getWeeklyStatistic(startDate: string, endDate: string) {
    const url = `/statistics/weekly`;
    const data = {
      params: {
        startDate: startDate,
        endDate: endDate,
      },
    };
    return apiClient.get(url, data);
  }
}
