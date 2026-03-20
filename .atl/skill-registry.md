# Skill Registry

Generated: 2026-03-19
Project: IA-Recipe-Generator

## Active Persistence Backend
- Preferred mode: engram
- Reason: Engram tooling is available and repository already contains `.engram/`

## Skill Sources Scanned
- User-level:
  - `C:/Users/ezefe/.claude/skills/` (not found)
  - `C:/Users/ezefe/.config/opencode/skills/` (not found)
  - `C:/Users/ezefe/.gemini/skills/` (not found)
  - `C:/Users/ezefe/.cursor/skills/` (not found)
  - `C:/Users/ezefe/.copilot/skills/` (found)
- Project-level:
  - `.claude/skills/` (not found)
  - `.gemini/skills/` (not found)
  - `.agent/skills/` (not found)
  - `skills/` (found)
  - `.github/skills/` (found)

## Registered Skills
- `go-testing`
  - Path: `C:/Users/ezefe/.copilot/skills/go-testing/SKILL.md`
  - Scope: user
  - Trigger: Go tests, Bubbletea TUI testing, adding test coverage
- `react-19`
  - Path: `C:/Users/ezefe/Desktop/IA-Recipe-Generator/skills/react-19/SKILL.md`
  - Scope: project
  - Trigger: React 19 project patterns and implementation workflow
- `recipe-prd-architect`
  - Path: `C:/Users/ezefe/Desktop/IA-Recipe-Generator/.github/skills/recipe-prd-architect/SKILL.md`
  - Scope: project
  - Trigger: Create/update recipe PRD with user flow, data model, and stack confirmation
- `ai-sdk-5`
  - Path: `C:/Users/ezefe/Desktop/IA-Recipe-Generator/skills/ai-sdk-5/SKILL.md`
  - Scope: project
  - Trigger: Vercel AI SDK 5 patterns and AI chat feature implementation
- `skill-creator`
  - Path: `C:/Users/ezefe/Desktop/IA-Recipe-Generator/skills/skill-creator/SKILL.md`
  - Scope: project
  - Trigger: Create new AI skills or agent instructions
- `tailwind-4`
  - Path: `C:/Users/ezefe/Desktop/IA-Recipe-Generator/skills/tailwind-4/SKILL.md`
  - Scope: project
  - Trigger: Tailwind CSS 4 conventions and utility-first architecture
- `typescript`
  - Path: `C:/Users/ezefe/Desktop/IA-Recipe-Generator/skills/typescript/SKILL.md`
  - Scope: project
  - Trigger: TypeScript strict typing and project standards

## Project Convention Files
- `AGENTS.md`
  - Type: project instruction index
  - Referenced local files detected: `./skills/react-19/SKILL.md`, `./skills/typescript/SKILL.md`, `./skills/tailwind-4/SKILL.md`, `./skills/skill-creator/SKILL.md`, `./skills/ai-sdk-5/SKILL.md`, `./.github/skills/recipe-prd-architect/SKILL.md`

## Exclusions Applied
- Skipped skill folders matching: `sdd-*`, `_shared`, `skill-registry`
- Dedup rule: project-level skill overrides user-level by `name`
