# FJG-86 - Informe de Revisión

**Estado General:** ✅ Aprobado

**Resumen:**
La implementación cumple satisfactoriamente con los objetivos de la issue FJG-86. La calculadora ahora utiliza utilidades basadas en `companySize` para derivar ingresos e inventario, y la inversión se calcula dinámicamente (base + variable por tamaño). Se ha introducido un mecanismo de "cap" para ROIs extremos (> 1.000%) que se utiliza consistentemente en la capa de presentación.

**Evidencia de Verificación por CA/DoD:**

1.  **CA1 (Lógica por tamaño de empresa):**
    *   ✅ Verificado: `lib/calculator/calculateROI.ts` implementa `getRevenueFromSize` y `getInventoryFromSize` reemplazando constantes fijas.
    *   ✅ Verificado: Las constantes `REVENUE_BY_SIZE` e `INVENTORY_BY_SIZE` cubren todos los casos de `CompanySize`.

2.  **CA2 (Inversión dinámica):**
    *   ✅ Verificado: `getInvestmentForPain` calcula la inversión sumando una base (`INVESTMENT_BASE`) y un componente variable (`INVESTMENT_MULTIPLIER * SIZE_FACTORS`), cumpliendo el requisito.

3.  **CA3 (Cap de ROI extremo):**
    *   ✅ Verificado: Se ha implementado `formatRoiWithCap` en `lib/calculator/calculateROI.ts`.
    *   ⚠️ Observación: `calculateROI` devuelve el valor numérico crudo. La aplicación del cap se delega a la capa de presentación (UI/Email) mediante el helper. Esto es aceptable ya que mantiene la precisión del cálculo subyacente mientras gestiona la visualización.

4.  **DoD (Tests):**
    *   ✅ Verificado: Los tests pasan correctamente (39 archivos, 120 tests exitosos), confirmando que la refactorización no introdujo regresiones y que la nueva lógica es estable.

**Observaciones de Seguridad, Mantenibilidad o Deuda Técnica:**
*   La solución es limpia y extensible. La separación de constantes y lógica de cálculo facilita futuros ajustes en los multiplicadores o bases sin tocar el flujo principal.

**Recomendaciones/Acciones Pendientes:**
*   Ninguna acción bloqueante. Se puede proceder al merge.