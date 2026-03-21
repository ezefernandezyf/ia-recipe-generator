# Recipe Generator PRD

Aplicacion web para generar recetas personalizadas a partir de ingredientes y preferencias del usuario. El proyecto esta hecho con React 19, TypeScript y Tailwind CSS 4, y sigue un flujo de trabajo SDD con documentacion en `docs/specs/`.

## Que hace

- Permite cargar ingredientes de forma interactiva.
- Valida nombre, cantidad y unidad antes de generar la receta.
- Envuelve el flujo de generacion en una unica pantalla.
- Mapea la respuesta del servicio a un modelo de dominio tipado.
- Muestra el resultado con ingredientes, instrucciones, macros, tiempo y dificultad.

## Tecnologias

- React 19
- TypeScript
- Tailwind CSS 4
- Vite 5
- Vitest + Testing Library
- React Router DOM

## Estructura

- `src/` - codigo fuente de la aplicacion.
- `src/features/recipe-generator/` - feature principal de generacion de recetas.
- `src/AppRoutes.tsx` - arbol de rutas de la aplicacion.
- `src/app.tsx` - composicion de la app.
- `src/main.tsx` - punto de entrada y montaje del root.
- `docs/specs/` - PRD, diseno, tareas y trazabilidad SDD.
- `.github/skills/` - skills auxiliares del proyecto.

## Requisitos Previos

- Node.js 18 o superior.
- npm 9 o superior.

## Instalacion

```bash
npm install
```

## Scripts

```bash
npm start       # desarrollo local
npm run dev     # alias de desarrollo local
npm run build   # build de produccion
npm run preview # preview del build
npm run serve   # alias de preview
npm run test    # suite de pruebas
```

## Desarrollo local

```bash
npm start
```

Luego abrilo en `http://localhost:5173`.

## Variables de entorno para IA

El generador ahora usa rutas internas en el servidor. Defini estas variables en `.env.local`:

```bash
AI_PROVIDER=groq
GROQ_API_KEY=tu_clave_de_groq
GOOGLE_GENERATIVE_AI_API_KEY=tu_clave_de_google
```

- `AI_PROVIDER` acepta `groq` o `google`.
- Las claves no deben exponerse con prefijos `VITE_*`.
- Si usas un solo proveedor, solo completá la variable correspondiente.

## Preview de produccion

```bash
npm run preview
```

## Calidad y pruebas

- El proyecto incluye pruebas unitarias para validacion y mapeo de dominio.
- Tambien incluye pruebas de componente e integracion para el flujo principal.
- La verificacion del cambio se hace con build, typecheck y tests.

## Documentacion del proyecto

- `docs/specs/recipe_gen_prd.md` - especificacion funcional.
- `docs/specs/design.md` - decisiones de arquitectura.
- `docs/specs/tasks.md` - checklist de implementacion.

## Contribuciones

Las contribuciones son bienvenidas. Abrí un issue o un pull request para proponer cambios.

## Licencia

Este proyecto esta bajo licencia MIT. Ver [LICENSE](LICENSE) para el texto completo.
