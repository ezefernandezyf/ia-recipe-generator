# Diseño del Sistema para el Generador de Recetas

## 1. Introducción
Este documento describe el diseño técnico del sistema para el generador de recetas, basado en las especificaciones y requisitos definidos en el documento `recipe_gen_prd.md`. Se detallan las decisiones arquitectónicas, la interacción entre componentes y el flujo de datos.

## 2. Arquitectura General
La arquitectura del sistema se basa en un enfoque de componentes, utilizando React 19 para la interfaz de usuario y TypeScript para el tipado estricto. La aplicación se estructura en módulos que encapsulan la lógica de negocio y la presentación.

### 2.1. Componentes Principales
- **App Component**: Punto de entrada de la aplicación, que configura el enrutamiento y el estado global.
- **Recipe Generator Feature**: Módulo dedicado a la generación de recetas, que incluye:
  - **UI Components**: Componentes de interfaz de usuario para la entrada de ingredientes, visualización de recetas y ajustes de usuario.
  - **Model**: Definiciones de datos para recetas, incluyendo ingredientes, macros, tiempo y dificultad.
  - **Services**: Servicios para la integración de IA, que manejan las llamadas a la API y la lógica de generación de recetas.

## 3. Flujo del Usuario
El usuario ingresará los ingredientes a través de un formulario interactivo. Este flujo se detalla a continuación:
1. **Ingreso de Ingredientes**: El usuario puede agregar, editar o eliminar ingredientes en un formulario.
2. **Generación de Recetas**: Al enviar el formulario, se invoca el servicio de IA que genera una receta basada en los ingredientes proporcionados.
3. **Visualización de Resultados**: La receta generada se muestra al usuario, permitiendo ajustes adicionales.

## 4. Modelo de Datos
El modelo de datos para una receta incluye los siguientes campos:
- **Ingredientes**: Lista de ingredientes con cantidades y unidades.
- **Macros**: Información nutricional, como calorías, proteínas, carbohidratos y grasas.
- **Tiempo de Preparación**: Tiempo estimado para preparar la receta.
- **Dificultad**: Nivel de dificultad de la receta (fácil, medio, difícil).

## 5. Interacción entre Componentes
Los componentes interactúan de la siguiente manera:
- El **Formulario de Ingredientes** envía datos al **Servicio de IA**.
- El **Servicio de IA** procesa los datos y devuelve una receta al **Componente de Visualización**.
- El **Componente de Visualización** presenta la receta generada al usuario.

## 6. Boundaries Finales de Implementación
- `src/AppRoutes.tsx`: frontera de enrutado para pantalla del generador de recetas.
- `src/main.tsx` y `src/app.tsx`: composición raíz y punto único de render de la aplicación.
- `components/IngredientForm.tsx`: orquesta filas de ingredientes y delega edición individual a `IngredientRow`.
- `components/IngredientRow.tsx`: componente controlado para nombre/cantidad/unidad/notas y feedback de validación por fila.
- `components/RecipeRequestPanel.tsx`: preferencias de porciones y notas generales del pedido.
- `components/RecipeGeneratorPage.tsx`: estado de formulario, validación previa al submit, loading/error, invocación de `generateRecipe`, y render de `RecipeResult`.
- `components/RecipeResult.tsx`: representación visual de receta final (ingredientes, macros, instrucciones y metadatos).
- `model/validation.ts`: validaciones puras reutilizables para ingredientes.
- `services/recipeMapper.ts`: adaptación resiliente de payload API a modelo de dominio con fallbacks seguros.
- `services/ai.ts`: frontera externa de red y mapeo de errores a mensajes seguros para usuario.

## 7. Cobertura de Verificación
- Unit: `validation.ts` (casos inválidos y válidos) y `recipeMapper.ts` (payload completo y parcial).
- Component: `IngredientForm.tsx` (agregar/quitar filas, feedback de validación).
- Integration: `RecipeGeneratorPage.tsx` con `generateRecipe` mockeado.

## 8. Conclusiones
Este diseño proporciona una base sólida para el desarrollo del generador de recetas, asegurando que se sigan las mejores prácticas de arquitectura y diseño de software. Se recomienda realizar revisiones periódicas del diseño a medida que se avanza en la implementación para adaptarse a posibles cambios en los requisitos o en la tecnología utilizada.

## 9. Nota de Decisiones (Hook Fixes)
- Se tiparon explícitamente `AppRoutes`, `App`, `rootElement` y `root` para cumplir estilo estricto de TypeScript sin alterar comportamiento de runtime.
- Se mantiene la frontera de routing en `src/AppRoutes.tsx` (y no embebida en `src/app.tsx`) para separar composición raíz de navegación, facilitar pruebas de rutas y conservar un punto único de evolución si aparecen nuevas pantallas.
- Se mantiene `src/components/index.ts` como barrel legacy vacío por compatibilidad transicional con imports históricos del repo; el barrel activo y con ownership vigente es `src/features/recipe-generator/components/index.ts`, evitando mezclar exportaciones globales nuevas con una capa en deprecación.