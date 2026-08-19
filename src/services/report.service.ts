import { ReportRepository } from "../repositories/report.repository";

export class ReportService {
  private reportRepository = new ReportRepository();

  async generateMonthlyReport(monthString: string, vehicleId?: number) {
    const [year, month] = monthString.split("-").map(Number);

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const monthStart = startDate.toISOString().split("T")[0];
    const monthEnd = endDate.toISOString().split("T")[0];

    const reportData = await this.reportRepository.getMonthlyReport(
      monthStart,
      monthEnd,
      vehicleId,
    );

    let topVehicle = null;
    let maxRevenue = -1;

    for (const row of reportData) {
      const revenue = Number(row.revenue);
      if (revenue > maxRevenue) {
        maxRevenue = revenue;
        topVehicle = row;
      }
    }

    return {
      month: monthString,
      top_performing_vehicle: maxRevenue > 0 ? topVehicle : null,
      data: reportData,
    };
  }
}
