import { Product } from "@/src/models/Product";

export interface ProductRepository {
  findByName(name: string): Promise<Product | null>;
  save(product: Product): Promise<undefined>;
}
