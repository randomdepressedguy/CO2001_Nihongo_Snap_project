# Nihongo Snap — Design Requirements

> **Status:** Design specification for redesigning the existing application.  
> **Primary goal:** Make Nihongo Snap feel like a thoughtful, friendly Japanese-learning product—not a generic AI-generated dashboard.

## 1. Product vision

Nihongo Snap helps learners discover, understand, practice, and remember Japanese. The interface must make the next useful action obvious, reduce anxiety for beginners, and reward learning progress without unnecessary distractions.

### Success criteria
- A new user can understand the main navigation and start a learning activity without instructions.
- A returning user can resume their last lesson in one or two actions.
- Japanese text (kanji, kana, furigana) remains readable at every supported screen size.
- Common tasks (review a word, save vocabulary, start a quiz, return to a lesson) have clear feedback and completion states.
- The app feels consistent on mobile and desktop and is usable with keyboard and assistive technology.

## 2. Visual direction

**Style:** Japanese editorial minimalism + warm, approachable learning experience.

**Desired:** calm, human, polished, playful in small doses, content-first, spacious but efficient.

**Avoid:** generic SaaS/AI dashboards; excessive gradient backgrounds; purple-blue neon glows; glassmorphism everywhere; giant rounded cards; dense KPI grids; decorative animations that obscure learning; arbitrary emojis as the primary icon system; inconsistent shadows and radii.

### Design principles
1. **Learning first:** prioritize lessons, vocabulary, and next actions over vanity metrics.
2. **Clarity over decoration:** every element must serve comprehension or interaction.
3. **Friendly, not childish:** subtle delight without clutter.
4. **Consistency:** reusable components, spacing, color, and interaction patterns.
5. **Progressive disclosure:** show beginner-friendly essentials first; reveal advanced details on demand.
6. **Accessible by default:** keyboard, contrast, reduced motion, and legible Japanese type.

## 3. Design tokens (starting proposal)

These are **initial tokens**, not an immutable palette. Validate against real screens and contrast tests before finalizing.

| Token | Light theme | Usage |
|---|---|---|
| `--background` | `#FAF8F3` | Warm off-white page background |
| `--surface` | `#FFFFFF` | Content panels and inputs |
| `--foreground` | `#252821` | Primary text |
| `--muted-foreground` | `#62675E` | Secondary text |
| `--primary` | `#A83D32` | Main CTA, selected state |
| `--primary-foreground` | `#FFFFFF` | Text on primary |
| `--accent` | `#E9EFE5` | Soft sage accent |
| `--border` | `#E5E2D9` | Subtle dividers |
| `--danger` | `#B42318` | Destructive actions and errors |
| `--focus-ring` | `#285F9A` | Clearly visible keyboard focus |

- Use a restrained palette: neutral foundation, one primary action color, and one supporting accent.
- Use semantic success/warning/error colors, **never color alone** to communicate meaning.
- Define dark theme tokens separately if dark mode is implemented; do not invert colors mechanically.
- Use an 8px-based spacing scale with 4px increments for compact UI.
- Suggested radii: 8px inputs, 12px cards, 16px large panels; avoid pill-shaped everything.
- Prefer borders and tonal separation; use shadows sparingly.

## 4. Typography and Japanese content

- Use a readable UI sans-serif (e.g., Inter) with Japanese fallback (e.g., Noto Sans JP). Check licensing and loading performance.
- Use a deliberate hierarchy: page title, section title, body, helper text; do not create arbitrary font sizes.
- Body text should normally be at least 16px; secondary labels should remain comfortably legible.
- Kanji and kana study content should be substantially larger (roughly 28–48px where appropriate).
- Support `ruby`/`rt` for furigana; ensure spacing and line height do not clip annotations.
- Do not rely on color alone to distinguish kanji, reading, meaning, or answer correctness.
- Preserve selectable/copyable Japanese text; avoid rendering study text as images.
- Design for Vietnamese and English UI text lengths, plus Japanese characters.

## 5. Layout and responsive behavior

- **Mobile first**, with responsive layouts at approximately 360px, 768px, 1024px, and 1440px widths.
- Desktop: restrained sidebar + focused main content; avoid unnecessarily wide reading columns.
- Mobile: compact header and bottom navigation for core destinations where appropriate.
- Keep primary actions within easy reach on mobile; touch targets should be at least ~44×44px where practical.
- Avoid horizontal scrolling in lessons, tables, forms, and quizzes unless intentionally designed.
- Respect safe areas, zoom up to 200%, long labels, and on-screen keyboards.

## 6. Screen-specific requirements

### Home / Dashboard
- Make **Continue learning** the primary action.
- Show the current lesson, one next recommended activity, and a small meaningful progress summary.
- Avoid an overwhelming grid of statistics, achievements, and unrelated widgets.
- Provide a welcoming empty state for first-time learners.

### Learning path
- Clearly group lessons by level (e.g., JLPT N5–N1 if supported by actual content).
- Distinguish completed, in-progress, available, and locked lessons with text/icon cues.
- Provide prerequisites and estimated effort when the underlying data supports them.
- Do not imply unavailable content is functional.

### Vocabulary / Flashcards
- Japanese word is the focal point; reading, meaning, examples, and audio are easy to access.
- Support reveal/flip interactions, keyboard controls, and clear review actions.
- Provide visible progress and an understandable session completion state.
- Avoid distracting card flip effects and auto-advancing before the user is ready.

### Camera / Snap flow
- Make the sequence obvious: **Capture/upload → recognize → inspect → save/practice**.
- Display confidence or uncertainty when recognition is imperfect; allow corrections.
- Explain camera permissions, failures, and supported file types.
- Keep upload and camera controls large and understandable on mobile.

### Notebook / Saved words
- Support clear search, filtering, sorting, and grouping if implemented.
- Make save/remove actions reversible where possible.
- Provide useful empty and no-results states.

### Quiz / Practice
- Present one clear task at a time; avoid excessive chrome around questions.
- Provide explicit correct/incorrect feedback and a short explanation where available.
- Support keyboard interaction, review of mistakes, and a meaningful summary.
- Do not use color alone for answer feedback.

### Settings / Profile
- Group preferences logically (language, audio, appearance, learning preferences).
- Explain the impact of settings; use confirmation for destructive actions.

## 7. Component system

Use the existing frontend architecture unless a technical audit justifies migration.

**Preferred tools, where compatible:** React + TypeScript, Tailwind CSS, shadcn/ui primitives, Lucide icons, Motion for restrained animation.

Create or standardize reusable components such as:
- `AppShell`, `DesktopSidebar`, `MobileNav`, `PageHeader`
- `PrimaryButton`, `SecondaryButton`, `IconButton`, `FormField`
- `LessonCard`, `ProgressIndicator`, `VocabularyCard`, `Flashcard`
- `QuizOption`, `FeedbackMessage`, `EmptyState`, `ErrorState`, `LoadingState`
- `ConfirmDialog`, `Toast`, `SearchField`

Use component variants and tokens instead of one-off inline styles. Do not introduce a new UI library without a clear reason.

## 8. Interaction and motion

- Animations should communicate state, continuity, or completion—not decorate every element.
- Typical microinteractions: 120–220ms; larger transitions: roughly 200–350ms when justified.
- Support `prefers-reduced-motion` and provide non-animated equivalents.
- Every actionable element must have hover (where applicable), focus, pressed, disabled, and loading states.
- Prevent duplicate submissions; explain errors in actionable language.
- Use skeletons only for genuine loading and avoid layout shifts.

## 9. Accessibility and usability

- Aim for **WCAG 2.2 AA** across core learning flows.
- Maintain at least 4.5:1 contrast for normal text and 3:1 for large text and relevant UI boundaries, with applicable exceptions.
- Ensure keyboard navigation, visible focus, sensible tab order, and accessible names.
- Use semantic headings, buttons, forms, labels, and landmarks.
- Make screen-reader announcements for quiz feedback, loading, and success where necessary.
- Do not trap focus except within correctly implemented modal dialogs.
- Provide meaningful alt text for informative images; mark decorative images accordingly.

## 10. Performance and implementation constraints

- Preserve existing business logic, routes, APIs, data models, authentication, and user progress unless changes are explicitly approved.
- Audit current dependencies before installing replacements; avoid duplicate component/animation libraries.
- Optimize images, lazy-load heavy features, and prevent unnecessary JavaScript bundles.
- Prefer real text, CSS, and SVG icons over large decorative assets.
- Test on touch devices, slow connections, and low-powered hardware.
- Avoid placeholder actions: if a feature is unavailable, clearly label or hide it.

## 11. Required UI states

For each major screen or component, design and test:

- Default and active states
- Loading and slow-network states
- Empty / first-time use
- No search results
- Success / completion
- Validation and recoverable errors
- Permission denied (camera/microphone if used)
- Offline or unavailable service, where relevant
- Disabled or locked content

## 12. Redesign workflow

1. **Audit:** inspect current pages, components, styles, flows, and dependencies. Capture existing functionality before modifying it.
2. **Information architecture:** define navigation and the main user journeys.
3. **Design foundation:** establish tokens, typography, layout primitives, and component variants.
4. **Pilot screen:** redesign Home and one core learning interaction to validate the visual direction.
5. **Systematic rollout:** update remaining screens using shared components.
6. **Functional QA:** verify that all existing working features still work.
7. **Visual/accessibility QA:** test mobile and desktop, contrast, keyboard, motion, and Japanese text.
8. **Polish:** refine content density, loading feedback, microcopy, and subtle animations.

## 13. Definition of done

A redesigned screen is complete only when:

- [ ] It follows the shared tokens and visual language.
- [ ] The main user goal is clear within seconds.
- [ ] It works at mobile, tablet, and desktop widths.
- [ ] It has real working interactions (not decorative placeholders).
- [ ] It covers relevant loading, empty, error, and success states.
- [ ] It is keyboard accessible with visible focus.
- [ ] Japanese text and furigana display correctly.
- [ ] Motion is restrained and respects reduced-motion preferences.
- [ ] Existing API/data behavior is preserved.
- [ ] No critical console errors or obvious layout shifts remain.

## 14. Instructions for AI coding agents

When implementing Nihongo Snap:

1. Read this file before making UI changes.
2. Inspect the existing codebase; **do not assume** a framework, route, or feature exists.
3. Prefer refining existing components over rebuilding the app from scratch.
4. Do not use generic AI dashboard aesthetics or gratuitous gradients/glows.
5. Keep the learning experience and Japanese typography central.
6. Reuse design tokens and shared components consistently.
7. Never remove or break working features solely for a visual redesign.
8. Implement complete UI states and real actions; do not invent fake data or progress.
9. Check responsive layouts and accessibility after each major screen.
10. Document any necessary deviations and unresolved issues.

---

**Guiding statement:** Nihongo Snap should feel like a calm, carefully crafted place to learn Japanese—welcoming on day one and useful after hundreds of study sessions.
