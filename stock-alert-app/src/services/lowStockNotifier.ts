import { StockAlert } from "../models/StockAlert";
import { NotificationService } from "./notificationService";
import { ProductService } from "./productService";

export class LowStockNotifier {
  private notificationService: NotificationService;

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  setupLowStockNotifications(productService: ProductService) {
    productService.subscribeToStockChanges((product, oldStock, newStock) => {
      if (
        newStock <= product.minStockLevel! &&
        oldStock > product.minStockLevel!
      ) {
        const alert: StockAlert = {
          productName: product.name,
          currentStock: newStock,
          minStockLevel: product.minStockLevel!,
        };
        this.notificationService.sendLowStockAlert(alert);
      }
    });
  }
}
