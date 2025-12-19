import { StockAlert } from "../models/StockAlert";

export interface NotificationService {
  sendLowStockAlert(alert: StockAlert): Promise<undefined>;
}
