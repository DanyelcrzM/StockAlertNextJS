import { ProductService } from "../productService";
import { Product } from "../../models/Product";
import { LowStockNotifier } from "../lowStockNotifier";

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

  it("should send alert when below min stock ", async () => {
    // Arrange
    const productName = "Camiseta Azul";
    const initialStock = 15;
    const decrementAmount = 5;
    const expectedStock = initialStock - decrementAmount;
    const minStockLevel = 10;

    const existingProduct: Product = {
      name: productName,
      stock: initialStock,
      minStockLevel: minStockLevel,
    };

    // Mocks
    const mockRepository = {
      findByName: jest.fn().mockResolvedValue(existingProduct),
      save: jest.fn().mockResolvedValue(undefined),
    };

    const mockNotificationService = {
      sendLowStockAlert: jest.fn().mockResolvedValue(undefined),
    };

    const service = new ProductService(mockRepository);
    const lowStockNotifier = new LowStockNotifier(mockNotificationService);

    // Act
    lowStockNotifier.setupLowStockNotifications(service);
    await service.decrementStock(productName, decrementAmount);

    // Assert
    expect(mockRepository.findByName).toHaveBeenCalledWith(productName);

    // Verifica que se envió la alerta de stock bajo
    expect(mockNotificationService.sendLowStockAlert).toHaveBeenCalledTimes(1);

    // Verifica los parámetros con los que se llamó
    const sentAlert =
      mockNotificationService.sendLowStockAlert.mock.calls[0][0];
    expect(sentAlert.productName).toBe(productName);
    expect(sentAlert.currentStock).toBe(expectedStock);
    expect(sentAlert.minStockLevel).toBe(minStockLevel);
  });
});
