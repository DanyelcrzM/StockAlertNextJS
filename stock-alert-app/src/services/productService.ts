import { ProductRepository } from "../domain/repositories/ProductRepository";
import { NotificationService } from "./notificationService";
import { StockAlert } from "../models/StockAlert";

export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private notificationService?: NotificationService
  ) {}

  async decrementStock(productName: string, amount: number): Promise<void> {
    const product = await this.productRepository.findByName(productName);

    const updatedProduct = {
      ...product!,
      stock: product!.stock - amount,
    };

    await this.productRepository.save(updatedProduct);

    //  NUEVO: Verificar si se debe enviar alerta de stock bajo

    if (
      this.notificationService &&
      updatedProduct.stock < updatedProduct.minStockLevel!
    ) {
      let alert: StockAlert = {
        productName: updatedProduct.name,
        currentStock: updatedProduct.stock,
        minStockLevel: updatedProduct.minStockLevel!,
      };

      this.notificationService.sendLowStockAlert(alert);
    }
  }
}
