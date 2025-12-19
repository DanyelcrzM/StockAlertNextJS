import { ProductService } from "../productService";
import { Product } from "../../models/Product";
import { StockAlert } from "@/src/models/StockAlert";

describe("ProductService", () => {
  // TEST EXISTENTE - Decremento básico (se mantiene igual)
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

  // NUEVO TEST - Escenario 1: Alerta de Stock Bajo
  it("should send alert when below min stock ", async () => {
    // Arrange
    const productName = "Camiseta Azul";
    const initialStock = 10; // Stock inicial por encima del mínimo
    const decrementAmount = 5; // Nivel mínimo configurado
    const expectedStock = initialStock - decrementAmount; // Reducción que lleva el stock por debajo del mínimo
    const minStockLevel = 10; // 5 unidades - por debajo del mínimo

    const existingProduct: Product = {
      name: productName,
      stock: initialStock,
      minStockLevel: minStockLevel, // ← ERROR: Propiedad no existe
    };

    // Mock del repositorio
    const mockRepository = {
      findByName: jest.fn().mockResolvedValue(existingProduct),
      save: jest.fn().mockResolvedValue(undefined),
    };

    const mockNotificationService = {
      sendLowStockAlert: jest.fn().mockResolvedValue(undefined),
    };

    const service = new ProductService(mockRepository, mockNotificationService);

    // Act
    await service.decrementStock(productName, decrementAmount);

    // Assert
    expect(mockRepository.findByName).toHaveBeenCalledWith(productName);

    // Verifica que se envió la alerta de stock bajo
    expect(mockNotificationService.sendLowStockAlert).toHaveBeenCalledTimes(1);

    // El sistema debe enviar una alerta indicando que el stock está por debajo del nivel mínimo
    const sentAlert: StockAlert =
      mockNotificationService.sendLowStockAlert.mock.calls[0][0]; // ← ERROR: Método / Clase no existe
    expect(sentAlert.productName).toBe(productName);
    expect(sentAlert.currentStock).toBe(expectedStock);
    expect(sentAlert.minStockLevel).toBe(minStockLevel);
  });
});
