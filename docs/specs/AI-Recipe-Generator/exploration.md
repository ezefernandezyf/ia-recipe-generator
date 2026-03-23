# Exploration: AI-Recipe-Generator Redesign & Hardening

## Current State
- Generation reliability is limited by basic `isLoading` gating in `RecipeGeneratorPage.tsx`; there is no request abort or in-flight deduplication, so repeated clicks can create race conditions.
- `IngredientForm.tsx` appends new rows to the bottom; users must scroll to see the newly added empty row.
- Validation is still custom (`model/validation.ts`) even though Zod 4 is available.
- The UI is functional but generic: slate palette, utility-first styling, limited typographic distinction, and weak visual hierarchy.

## Affected Areas
- `src/features/recipe-generator/components/RecipeGeneratorPage.tsx` — request orchestration and reliability guards.
- `src/features/recipe-generator/components/IngredientForm.tsx` — ingredient insertion order.
- `src/features/recipe-generator/components/IngredientRow.tsx` — visual treatment and validation feedback.
- `src/features/recipe-generator/services/ai.ts` — fetch boundary, abort support.
- `src/features/recipe-generator/model/validation.ts` — Zod 4 migration path.
- `src/index.css` and feature components — design system refresh.

## Approaches
1. AbortController + local state hardening
- Pros: no dependency cost, fixes click/race issues quickly.
- Cons: manual cleanup, no built-in retry/dedup.
- Effort: Medium.

2. TanStack Query v5
- Pros: robust request lifecycle management.
- Cons: heavier refactor, more setup, likely overkill for one endpoint.
- Effort: High.

3. Hybrid
- Pros: fastest path to reliability, lower risk.
- Cons: possible second refactor later.
- Effort: Medium.

## Recommendation
Start with the hybrid path: local AbortController/request guard hardening, ingredient insertion to the top, and a frontend redesign pass that commits to a stronger editorial aesthetic. Migrate validation to Zod 4 in the form layer. Evaluate TanStack Query only if the app expands beyond the single recipe request or the retry logic becomes more complex.

## Risks
- Overengineering with TanStack Query too early.
- Visual redesign becoming inconsistent if no clear aesthetic direction is chosen.
- Zod migration could break current form expectations if request and form schemas are not separated.

## Ready for Proposal
Yes