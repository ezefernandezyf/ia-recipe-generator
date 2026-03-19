# Tasks: initial-requirements

## Phase 1: Foundation

- [x] 1.1 Normalize domain types in `src/features/recipe-generator/model/recipe.ts` (ingredient, macros, difficulty, times) to match `docs/specs/recipe_gen_prd.md`.
- [x] 1.2 Add `src/features/recipe-generator/model/validation.ts` with typed validators for ingredient input (required name, quantity > 0, allowed unit).
- [x] 1.3 Add `src/features/recipe-generator/model/defaults.ts` with default form state and helpers for empty ingredient rows.

## Phase 2: Core Implementation

- [x] 2.1 Create `src/features/recipe-generator/components/IngredientForm.tsx` with add/edit/remove ingredient rows.
- [x] 2.2 Create `src/features/recipe-generator/components/IngredientRow.tsx` with controlled inputs for `name`, `quantity`, `unit`.
- [x] 2.3 Create `src/features/recipe-generator/components/RecipeRequestPanel.tsx` for servings and optional notes/preferences.
- [x] 2.4 Refactor `src/features/recipe-generator/services/ai.ts` to use strict request/response types (remove `any`) and map API errors to user-safe messages.
- [x] 2.5 Create `src/features/recipe-generator/services/recipeMapper.ts` to transform API payloads into `Recipe` model.

## Phase 3: Integration and Wiring

- [x] 3.1 Create `src/features/recipe-generator/components/RecipeResult.tsx` to render title, ingredients, instructions, macros, prep time, and difficulty.
- [x] 3.2 Create `src/features/recipe-generator/components/RecipeGeneratorPage.tsx` to orchestrate form submit, loading state, error state, and result rendering.
- [x] 3.3 Update `src/features/recipe-generator/components/index.ts` to export all new feature components.
- [x] 3.4 Wire route/page in `src/AppRoutes.tsx` (or create it if missing) for the recipe generator screen.
- [x] 3.5 Ensure root composition remains valid between `src/main.tsx` and `src/app.tsx` (single render entrypoint).

## Phase 4: Testing and Verification

- [x] 4.1 Add test setup (Vitest + Testing Library) in `package.json`, `vitest.config.ts`, and `src/test/setup.ts`.
- [x] 4.2 Add unit tests for `model/validation.ts` covering invalid quantity, missing name, and valid ingredient cases.
- [x] 4.3 Add unit tests for `services/recipeMapper.ts` covering full payload and partial payload fallbacks.
- [x] 4.4 Add component tests for `IngredientForm.tsx` (add/remove rows, validation feedback).
- [x] 4.5 Add integration test for `RecipeGeneratorPage.tsx` with mocked `generateRecipe` service.

## Phase 5: Docs and Handoff

- [x] 5.1 Update `docs/specs/recipe_gen_prd.md` if implementation decisions alter field names or flow details.
- [x] 5.2 Update `docs/specs/design.md` with final component/service boundaries after wiring.
- [x] 5.3 Mark completed items in this file and prepare verify handoff checklist.

## Verify Handoff Checklist

- [x] Proposal/spec/design/tasks artifacts available in Engram (`sdd/initial-requirements/*`).
- [x] Test setup present (`vitest.config.ts`, `src/test/setup.ts`, `package.json` scripts).
- [x] Unit tests present for `validation.ts` and `recipeMapper.ts`.
- [x] Component/integration tests present for `IngredientForm.tsx` and `RecipeGeneratorPage.tsx`.
- [x] Documentation synchronized (`recipe_gen_prd.md` and `design.md`).
- [x] Ready to run `sdd-verify` for `initial-requirements`.