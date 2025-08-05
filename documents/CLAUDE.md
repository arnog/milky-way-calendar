# Documents Directory Guide

This directory contains comprehensive project documentation for the Milky Way
Calendar application, organized for easy reference and historical preservation.

## Active Documentation

### CODING_GUIDELINES.md

- **Purpose**: Development standards and best practices
- **Contains**: Code style rules, naming conventions, testing guidelines
- **When to use**: Before writing code, during code reviews, onboarding new
  developers

### HISTORY.md

- **Purpose**: Technical implementation history and architectural decisions
- **Contains**: Bug fixes, coordinate system corrections, algorithm migrations,
  library changes
- **When to use**: Understanding why technical decisions were made, debugging
  similar issues

### REQUIREMENTS.md

- **Purpose**: Original project specifications and feature requirements
- **Contains**: Core functionality definitions, user needs, technical
  constraints
- **When to use**: Understanding project scope, validating feature completeness

### UI_DESIGN_SYSTEM.md

- **Purpose**: Visual design standards and component specifications
- **Contains**: Color palette, typography, component styles, design patterns
- **When to use**: Implementing UI components, maintaining visual consistency

## Archive Directory

Contains historical documents from specific development phases that provide
detailed context for major feature implementations:

### ALGORITHM_REFINEMENT.md

- **Phase**: Algorithm optimization and mathematical improvements
- **Focus**: Time-integrated calculations, astronomical accuracy enhancements

### ARCHITECTURE.md

- **Phase**: System architecture planning and component organization
- **Focus**: Code structure, data flow, component relationships

### ASTRONOMICAL_CLOCK.md

- **Phase**: Clock visualization feature development
- **Focus**: SVG implementation, time positioning, interactive elements

### CODE_REVIEW.md

- **Phase**: Code quality and testing improvements
- **Focus**: Test coverage, bug prevention, quality assurance

### IMPLEMENTATION_SUMMARY.md

- **Phase**: Feature completion and integration summaries
- **Focus**: Completed features, integration points, deployment readiness

### TIME_INTEGRATED_WINDOWS.md

- **Phase**: Viewing window calculation improvements
- **Focus**: Quality analysis algorithms, observation period optimization

## Document Relationships

- **REQUIREMENTS.md** → **ARCHITECTURE.md** → **IMPLEMENTATION_SUMMARY.md**:
  Project planning to completion flow
- **CODING_GUIDELINES.md** ↔ **CODE_REVIEW.md**: Development standards and
  quality assurance
- **HISTORY.md**: Cross-references all phases and provides technical context

## Usage Guidelines

1. **Starting new features**: Review REQUIREMENTS.md and CODING_GUIDELINES.md
2. **Understanding existing code**: Check HISTORY.md for implementation context
3. **UI/UX work**: Reference UI_DESIGN_SYSTEM.md
4. **Debugging issues**: Look for similar problems in HISTORY.md and archived
   phase documents
5. **Code reviews**: Use CODING_GUIDELINES.md and CODE_REVIEW.md as checklists

## Maintenance

- Keep active documents updated with significant changes
- Archive phase-specific documents when major features are completed
- Update this guide when adding new documentation
- Cross-reference related documents to maintain information connectivity
