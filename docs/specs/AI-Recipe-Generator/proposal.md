# Proposal: AI-Recipe-Generator

## Intent
Harden the recipe generator so repeated clicks do not cause flaky generation, modernize the UI with a distinctive polished aesthetic, and standardize form validation with Zod 4. Keep the solution lean first, while leaving room to adopt TanStack Query only if the app grows beyond a single mutation flow.

## Scope
### In Scope
- Add abortable request handling and in-flight request guards to recipe generation.
- Move new ingredient rows to the top of the list.
- Migrate form validation to Zod 4 schemas and resolver-based validation.
- Refresh the frontend design system with a deliberate, production-grade visual direction.
- Evaluate TanStack Query in a spike and adopt it only if the local approach is insufficient.

### Out of Scope
- Streaming AI responses.
- Backend/provider expansion beyond the current recipe flow.
- Full app-wide state management rewrite.

## Approach
Use a hybrid MVP-hardening path: implement AbortController-driven request cancellation and request ordering protection first, while restructuring form validation around Zod 4. In parallel, apply a cohesive editorial design system across the recipe feature. Treat TanStack Query as an optional follow-up if multi-endpoint growth or retry complexity justifies it.

## Affected Areas
| Area | Impact | Description |
|------|--------|-------------|
| `src/features/recipe-generator/components/RecipeGeneratorPage.tsx` | Modified | Request orchestration, loading/error handling |
| `src/features/recipe-generator/components/IngredientForm.tsx` | Modified | Top insertion for new ingredient row |
| `src/features/recipe-generator/components/IngredientRow.tsx` | Modified | Visual polish and validation states |
| `src/features/recipe-generator/services/ai.ts` | Modified | Abortable fetch boundary |
| `src/features/recipe-generator/model/validation.ts` | Modified | Zod 4 migration |
| `src/index.css` | Modified | Design tokens/theme refresh |

## Risks
| Risk | Likelihood | Mitigation |
|------|------------|------------|
| TanStack Query overengineering | Medium | Defer until justified by growth |
| Design inconsistency | Medium | Commit to one aesthetic system early |
| Schema migration regressions | Low | Keep request/form schemas separate and test parsing |

## Rollback Plan
Revert the request-cancellation and validation changes independently from the UI redesign. If the Zod migration causes regressions, fall back to the current validation module while preserving the UI work.

## Dependencies
- Zod 4 skill and validation patterns.
- Frontend design skill for a stronger visual direction.
- Human approval before `apply`.

## Success Criteria
- [ ] Repeated generate clicks no longer produce flaky or stale results.
- [ ] New ingredient rows appear at the top immediately.
- [ ] Form validation is driven by Zod 4 schemas.
- [ ] The recipe feature has a visibly more polished, intentional design.
- [ ] TanStack Query is only introduced if the evaluation proves it necessary.