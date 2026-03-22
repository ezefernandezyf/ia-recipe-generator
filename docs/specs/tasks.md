# Tasks: AGENTS Compliance Hardening

## Phase 1: Audit / Approval Gate

- [x] 1.1 Review `src/features/recipe-generator/components/RecipeResult.tsx` and `RecipeRequestPanel.tsx` against the typed component pattern in `src/app.tsx` and `src/AppRoutes.tsx`.
- [x] 1.2 Audit `src/features/recipe-generator/**` for real literal `any`, non-defensive `unknown`, and `Partial<T>` outside local patch or test-builder scope.
- [x] 1.3 Confirm `README.md` and `package.json` still agree on `npm run dev` and the documented scripts.

## Phase 2: Code Compliance Fixes

- [x] 2.1 Add `RecipeResultView` and `RecipeRequestPanelView` aliases and explicit return types to the two untyped recipe components.
- [x] 2.2 Fix only verified typing violations from Phase 1, using narrow defensive helpers or explicit domain types instead of broad `unknown` or `Partial<T>` rewrites.
- [x] 2.3 Update `README.md` only if the developer script documentation drifts from `package.json`.

## Phase 3: Verification / Human in the Loop

- [x] 3.1 Run the recipe-generator component tests to confirm the typed components still render and behavior is unchanged.
- [x] 3.2 Run typecheck and the focused feature tests to confirm no new AGENTS compliance regressions were introduced.
- [x] 3.3 Re-scan the touched scope for remaining real violations, then pause for human approval before `sdd-apply` continues.