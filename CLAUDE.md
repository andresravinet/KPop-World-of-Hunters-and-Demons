# CLAUDE.md

This file provides guidance to AI assistants (Claude and others) working in this repository.

## Project Overview

**KPop-World-of-Hunters-and-Demons** is a project in its initial state. Only the repository and a title README have been created so far. The name suggests a K-Pop themed world with game/fantasy elements (hunters and demons), but no source code, framework choices, or architecture have been established yet.

> **Note:** This CLAUDE.md was created at repository initialization. As the project grows, update this file to reflect actual structure, tooling, and conventions.

## Current Repository State

```
KPop-World-of-Hunters-and-Demons/
├── README.md       # Project title only
└── CLAUDE.md       # This file
```

- No source code exists yet
- No language, framework, or build tooling has been chosen
- No tests, CI/CD, or linting infrastructure is in place

## Git Workflow

### Branches

- `master` — main branch; represents stable/released state
- Feature branches should follow the pattern: `<username>/<short-description>`
- Claude AI branches use the pattern: `claude/<session-id>`

### Commits

Write clear, imperative commit messages:

```
Add player character class with health and attack stats
Fix demon spawn logic at map boundaries
Update README with setup instructions
```

- Keep the subject line under 72 characters
- Use the body to explain *why*, not *what*, when the change is non-obvious
- Reference issue numbers when applicable: `Fixes #42`

### Pull Requests

- Open a PR against `master` for all feature work
- Include a description of what changed and why
- PRs should not be merged without at least one passing CI check (once CI is set up)

## Development Conventions (to be established)

These sections should be filled in once the project stack is chosen.

### Language & Framework

_Not yet determined. Update this section once a stack is chosen (e.g., Python/Pygame, TypeScript/React, Godot GDScript, Unity C#, etc.)._

### Project Structure

_Document the intended directory layout here once source files are added._

### Running the Project

_Add setup and run instructions here._

```bash
# Example placeholders — replace with real commands
# install dependencies
# run development server / game
# run tests
```

### Testing

_Describe the testing approach, test runner, and how to run tests._

### Code Style

_Define formatting, linting tools, and style rules once a language is chosen._

## Key Decisions to Document

When the following decisions are made, record them here so future contributors (human and AI) have the context:

- [ ] Language / runtime choice
- [ ] Framework or engine selection
- [ ] Game/app architecture (scenes, entities, modules, etc.)
- [ ] Data storage approach (local save files, database, cloud sync)
- [ ] Asset pipeline for K-Pop themed art and audio
- [ ] Multiplayer / networking strategy (if applicable)

## Notes for AI Assistants

- This repository is in early planning stage — no existing code should be assumed
- Do not invent implementation details; ask for clarification if direction is unclear
- When adding source code, also update this CLAUDE.md to reflect new structure and workflows
- Prefer small, focused commits over large monolithic changes
- Keep this file accurate and up to date as the project evolves
