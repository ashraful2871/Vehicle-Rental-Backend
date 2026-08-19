import { Request, Response } from "express";
import Joi from "joi";
import { ReportService } from "../services/report.service";

const reportQuerySchema = Joi.object({
  month: Joi.string()
    .pattern(/^\d{4}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "Month must be in YYYY-MM format",
      "any.required": "Month query parameter is required",
    }),
  vehicle_id: Joi.number().optional(),
});

export class ReportController {
  private reportService = new ReportService();

  getRentalsReport = async (req: Request, res: Response) => {
    try {
      const { error, value } = reportQuerySchema.validate(req.query);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const report = await this.reportService.generateMonthlyReport(
        value.month,
        value.vehicle_id,
      );
      res.json(report);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
