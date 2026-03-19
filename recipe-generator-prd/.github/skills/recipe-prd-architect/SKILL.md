# Contenido del archivo: /recipe-generator-prd/.github/skills/recipe-prd-architect/SKILL.md

# Skill: recipe-prd-architect

## Descripción
Este skill se utiliza para crear o actualizar el Documento de Requerimientos del Producto (PRD) para el generador de recetas, basado en el contenido de AGENTS.md. Cubre el flujo de entrada de ingredientes del usuario, el modelo de datos de la receta (macros, tiempo, dificultad) y la confirmación del stack tecnológico (React 19, TypeScript, Tailwind 4).

## Flujo del Usuario
1. **Ingreso de Ingredientes**: 
   - El usuario puede ingresar los ingredientes a través de un formulario interactivo.
   - Se validará la entrada para asegurar que los ingredientes sean correctos y estén en el formato adecuado.
   - Se proporcionará retroalimentación en tiempo real sobre la validez de los ingredientes ingresados.

## Modelo de Datos
- **Receta**:
  - `id`: string (identificador único de la receta)
  - `nombre`: string (nombre de la receta)
  - `ingredientes`: array (lista de ingredientes, cada uno con su cantidad y unidad)
  - `macros`: object (información nutricional, incluyendo calorías, proteínas, carbohidratos, grasas)
  - `tiempo`: number (tiempo de preparación en minutos)
  - `dificultad`: string (nivel de dificultad: fácil, medio, difícil)
  - `instrucciones`: string (pasos para preparar la receta)

## Stack Técnico
- **Frontend**: 
  - React 19
  - TypeScript
  - Tailwind CSS 4

## Instrucciones
- Asegúrate de seguir las convenciones de tipado estricto y no utilizar `any`.
- Registra cada decisión arquitectónica importante en el MCP de Engram.
- Valida cada cambio con el Gentleman Guardian Angel (GGA) antes de implementarlo.