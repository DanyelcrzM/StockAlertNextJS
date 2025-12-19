import { ProductRepository } from "../domain/repositories/ProductRepository";
import { Product } from "@/src/models/Product";

export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async decrementStock(productName: string, amount: number): Promise<void> {
    // 1. Buscar producto por nombre (como especifica el escenario)
    const product = await this.productRepository.findByName(productName);
    // 2. Decrementar el stock en la cantidad especificada
    const updatedProduct = {
      ...product!,
      stock: product!.stock - amount,
    };
    // 3. Guardar el producto actualizado
    await this.productRepository.save(updatedProduct);
  }

  // async decrementProductStock(
  //   productName: string,
  //   amount: number
  // ): Promise<void> {
  //   throw new Error("Método decrementStock no implementado aún - Fase Roja");
  // }
}
