import { ProductService } from "../productService";
import { Product } from "../../models/Product";

describe("ProductService", () => {
  it("should decrement existing product stock", async () => {
    // Arrange
    const productName = "Camiseta";
    const initialStock = 10;
    const decrementAmount = 5;
    const expectedStock = initialStock - decrementAmount;

    const existingProduct: Product = {
      name: productName,
      stock: initialStock,
    };

    // Mock del repositorio
    const mockRepository = {
      findByName: jest.fn().mockResolvedValue(existingProduct),
      save: jest.fn().mockResolvedValue(undefined),
    };

    const service = new ProductService(mockRepository);

    // Act
    await service.decrementStock(productName, decrementAmount);

    // Assert
    // Verificación de búsqueda por nombre
    expect(mockRepository.findByName).toHaveBeenCalledWith(productName);

    // Verificación de decremento correcto
    expect(mockRepository.save).toHaveBeenCalledWith({
      ...existingProduct,
      stock: expectedStock,
    });
  });
});
