import { ProductRepository } from "../domain/repositories/ProductRepository";
import { Product } from "../models/Product";

export class ProductService {
  private stockChangeSubscribers: Array<any> = [];

  constructor(private productRepository: ProductRepository) {}

  async decrementStock(productName: string, amount: number): Promise<void> {
    const product = await this.productRepository.findByName(productName);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    const oldStock = product.stock;

    product.stock = product.stock - amount;

    this.productRepository.save(product);

    // Notificar a los suscriptores del cambio de stock
    this.notifyStockChangeSubscribers(product, oldStock, product.stock);
  }

  // Notificar a todos los suscriptores
  private notifyStockChangeSubscribers(
    product: Product,
    oldStock: number,
    newStock: number
  ) {
    this.stockChangeSubscribers.forEach((subscriber) => {
      try {
        subscriber(product, oldStock, newStock);
      } catch (e: any) {
        console.error("Error en suscriptor:", e.message);
      }
    });
  }

  subscribeToStockChanges(
    onStockChange: (
      product: Product,
      oldStock: number,
      newStock: number
    ) => void
  ) {
    this.stockChangeSubscribers.push(onStockChange);
  }
}
