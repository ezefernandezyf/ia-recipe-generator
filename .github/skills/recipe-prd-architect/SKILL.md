---
name: recipe-prd-architect
description: "Use when: creating or updating the PRD for recipe-generator-prd from AGENTS.md using SDD. Covers user ingredient-input flow, recipe data model (macros/time/difficulty), and stack confirmation (React 19 + TypeScript + Tailwind 4)."
argument-hint: "target-doc=docs/specs/recipe_gen_prd.md focus=flow|model|stack"
user-invocable: true
---

# Recipe PRD Architect

## Purpose
Create or update a high-quality PRD aligned with project conventions in AGENTS.md.

The skill produces a PRD that is explicit about:
- User flow for ingredient entry
- Recipe data model with strict typing expectations
- Confirmed technical stack and verification level

## When to Use
- You need to write `docs/specs/recipe_gen_prd.md` from scratch.
- You need to refactor an existing PRD without changing product intent.
- You need to reconcile AGENTS constraints with current repository reality.

## Inputs
- Project instruction source: `AGENTS.md`
- Existing PRD (if any): `docs/specs/recipe_gen_prd.md`
- Evidence files (verification): `package.json`, `README.md`, `src/app.tsx`, `vite.config.ts`

## Procedure
1. Read `AGENTS.md` and extract non-negotiables.
2. Read current PRD and classify sections as: keep, update, replace.
3. Verify claims against repository evidence before asserting them.
4. Write/refresh PRD sections in this order:
   - Product objective and scope
   - User flow for ingredient input
   - Data model for recipe and supporting types
   - Technical stack confirmation and constraints
   - Acceptance criteria and out-of-scope
5. Add a short "Assumptions and Gaps" section when evidence is incomplete.
6. Save updates to `docs/specs/recipe_gen_prd.md` preserving language consistency.

## Decision Points
- Existing PRD quality:
  - If mostly correct: merge and tighten wording.
  - If inconsistent/outdated: rewrite while preserving intent.
- Stack mismatch:
  - If AGENTS and manifests disagree: state both "declared" vs "verified".
- Missing files/dependencies:
  - Document the gap and avoid pretending runtime is healthy.

## PRD Content Requirements

### 1) User Flow: Ingredient Entry
Must define:
- Entry modes (manual typing, list management)
- Validation behavior (empty, duplicates, quantity format)
- Edit/remove interactions
- Transition from ingredients to recipe generation/review
- Error and empty-state UX expectations

### 2) Data Model: Recipe
Must include, at minimum:
- Recipe identity: `id`, `title`
- Ingredient collection with typed fields
- Nutrition/macros: calories, protein, carbs, fats
- Timing: preparation or total time in minutes
- Difficulty with explicit finite values
- Optional metadata (servings, tags, createdAt) marked as optional

### 3) Technical Stack Confirmation
Must explicitly state:
- React 19
- TypeScript (strict typing, no `any` in domain model)
- Tailwind CSS 4
- Verification note from repository evidence (declared vs installed)

## Quality Gates (Done Criteria)
- PRD contains all three requested dimensions: flow, model, stack.
- Domain model is unambiguous and implementation-ready.
- Every technical claim is either verified or marked as assumption.
- Language is concise and decision-oriented (not tutorial-style).
- No contradiction with `AGENTS.md` constraints.

## Output Contract
Return a short structured summary:
- `status`
- `executive_summary`
- `artifacts` (updated file paths)
- `risks` (if evidence gaps remain)
- `next_recommended`
