# Especificación del Generador de Recetas

## 1. Flujo del Usuario
El usuario ingresará los ingredientes a través de un formulario interactivo en la interfaz de usuario. Este formulario permitirá la entrada de múltiples ingredientes, donde cada ingrediente incluirá campos para:

- Nombre del ingrediente
- Cantidad
- Unidad de medida (por ejemplo, gramos, mililitros, tazas)
- Opcionalmente, notas o comentarios sobre el ingrediente

El flujo será el siguiente:
1. El usuario accede a la página principal del generador de recetas.
2. Se presenta un formulario para ingresar los ingredientes.
3. El usuario completa los campos y puede agregar más ingredientes según sea necesario.
4. Al finalizar, el usuario envía el formulario para generar la receta.

## 2. Modelo de Datos
La receta se estructurará con los siguientes campos:

- **title**: Nombre de la receta.
- **ingredients**: Lista de ingredientes, donde cada ingrediente tendrá:
  - `name`: string
  - `quantity`: number
  - `unit`: `'g' | 'kg' | 'ml' | 'l' | 'cup' | 'tbsp' | 'tsp' | 'unit'`
  - `notes`: string (opcional)
- **instructions**: `string[]` con pasos de preparación.
- **macros**: Información nutricional:
  - `calories`: number
  - `protein`: number
  - `carbohydrates`: number
  - `fats`: number
- **preparationTimeMinutes**: number.
- **totalTimeMinutes**: number (opcional).
- **servings**: number (opcional).
- **difficulty**: `'easy' | 'medium' | 'hard'`.

## 3. Stack Técnico
El proyecto utilizará las siguientes tecnologías:

- **Frontend**: 
  - **React 19**: Para la construcción de la interfaz de usuario.
  - **TypeScript**: Para asegurar un tipado estricto y mejorar la mantenibilidad del código.
  - **Tailwind CSS 4**: Para el diseño y la estilización de la aplicación.

- **Generación de IA**: 
  - **Vercel AI SDK** o integración directa con APIs para la generación de recetas basadas en los ingredientes ingresados por el usuario.

## 4. Consideraciones Adicionales
- Se implementó validación tipada para ingredientes: nombre obligatorio, cantidad > 0 y unidad dentro del catálogo permitido.
- La interfaz será responsiva, permitiendo su uso en dispositivos móviles y de escritorio.
- Se considerará la accesibilidad para garantizar que todos los usuarios puedan interactuar con la aplicación sin dificultades.

## 5. Estrategia de Pruebas
- Pruebas unitarias para `model/validation.ts` y `services/recipeMapper.ts`.
- Pruebas de componentes para `IngredientForm.tsx`.
- Prueba de integración para `RecipeGeneratorPage.tsx` con mock del servicio `generateRecipe`.

## 6. Estado de Implementación y Handoff
- Flujo principal implementado en `RecipeGeneratorPage.tsx` con formulario, validación previa, submit, loading, error y render de resultado.
- Frontera de integración con IA implementada en `services/ai.ts` y normalización de payload en `services/recipeMapper.ts`.
- Ruteo del feature conectado mediante `src/AppRoutes.tsx` y composición de entrada en `src/main.tsx`/`src/app.tsx`.
- Cobertura de pruebas disponible para validación de dominio, mapeo de servicio, componente de formulario e integración de página.
- Checklist de verify y estado de tareas mantenidos en `docs/specs/tasks.md`.