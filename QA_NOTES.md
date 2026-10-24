# Nihongo Snap vintage website — QA notes

Scope: four main destinations (flashcards, notebook, review, dictionary), retaining version 2 data and existing authenticated API behavior. The supplied DESIGN_REQUIREMENTS.md guides this change. A compact collection/start-review screen replaces the old general dashboard. The UI has no AI dependency.

## Browser observations
- Desktop preview renders all four destinations and native accessible dialogs.
- Dictionary word -> detail -> save to selected deck works. The saved state disables duplicate saving.
- Notebook editing persists a personal note. Favorites toggle and survive reload.
- Remove/Undo restores the word and its schedule/note/favorite.
- Keyboard Space reveals a flashcard; keyboard 3 records Good and opens a real session completion summary.
- The due count decreases and the next review date survives page reload.
- A free typed session rejects `inu` for 猫, disables successful grades, and repeats the word once. Full-width `ＮＥＫＯ` is accepted. The original review date remains unchanged.
- JSON export downloads successfully. Importing that same file reports zero new words and preserves existing data.
- Responsive layouts were visually inspected in same-origin 360px and 768px iframe viewports in the browser, alongside the desktop viewport. The bottom navigation now has five destinations including Home. Notebook entries stack on mobile. These are layout checks, not emulation of physical phones.

## Automated validation
21 Node tests cover domain data, intervals, duplicate-safe/atomic import, backup roundtrip, due ordering, deck consolidation, Vietnamese accent search and UUID generation without randomUUID. TypeScript checks are required and production build runs before source push/publication.

## Fixes found during QA
- Added cryptographic UUID fallback for HTTP previews (randomUUID requires a secure context).
- Corrected oversized kana selectors that accidentally targeted secondary readings.
- Replaced generic dictionary examples with authored sentences.
- Prevented invalid stored data from being overwritten by a blank default state.
- Save operations are serialized, with visible Saving/Saved/Error states and retry.
- Wrong quiz answers cannot be graded as remembered.
- Import does not reset existing schedules, notes or favorites.
- Removing a deck moves words and consolidates duplicates without dropping notes or delaying due dates. Very long combined notes stop the operation with an error.

## Remaining limits
- Speech output depends on browser/device Japanese voices; physical audio output and mobile OS behavior were not independently verified.
- Auth and account isolation are verified against the real Worker services with an isolated Miniflare D1 database. End-to-end password entry was intentionally not performed in the browser. Hosted Google OAuth and email verification/reset are not configured.
- No service worker or installable offline shell. Loaded content remains usable without a network; cold opening needs the website to load.
- Multiple browser tabs can overwrite each other's local edits; cross-tab merging is not implemented. Use one tab for editing.
- The current session queue is not restored after reload. Every completed answer remains saved; unanswered words stay due.
- Manual contrast checks cover shared text/primary/focus color pairs, not an independent full WCAG audit. Native screen readers, 200% zoom and real low-powered devices were not fully tested.

## Account and routing revision (2026-10-22)
- Replaced hash destinations with actual homepage, four feature routes, sign-in, registration and protected account routes. Shared app state persists between feature pages.
- Added server account identity, salted scrypt password storage, session cookies, same-origin checks, rate limits and password-change session revocation. The existing platform private access gate remains intact.
- Worker integration tests exercise registration, duplicate registration, wrong and correct credentials, random session rotation, account profile update, password change, old-session revocation, logout, two-account data isolation, authenticated D1 read/write, stale-revision conflicts, registration validation, CSRF rejection and throttling.
- Pure tests additionally cover scrypt verification, random token digests, safe redirect paths and initial synchronization decisions for pending edits/conflicts.
- Original Fuji illustration, paper/indigo/vermilion colors, serif headings and neutral labels replace the former compact dashboard styling. Google login is not represented as an active action.

- Current revision browser QA confirms all four actual feature URLs, login and registration pages, saving a dictionary word, navigating to Notebook, and persistence after reload. Home, Notebook, Dictionary and Login were visually checked at 360px and 768px using same-origin iframe viewports. A 1px overflow from an older topic-list margin was corrected.
- Account session expiry now returns 401 for state storage instead of falling back to the platform guest identity. The interface preserves local changes and requests sign-in again.

## Navigation reliability (2026-10-22)
- A hosted visitor reported that feature navigation remained unresponsive after a hard refresh while the language switch still worked. The failure was not reproduced in the managed development preview or the exact production build; hosted HTML and 20 referenced JavaScript assets returned 200 during service-access diagnostics.
- Main links now use standard document navigation instead of intercepting navigation through the client router. Existing page URLs, browser history, open-in-new-tab behavior and access controls are retained.
- Device edits are flushed before normal link navigation. Unread or invalid caches are never replaced during navigation. Feature action buttons use the same navigation path.
- The review controls and grading behavior are unchanged. Exact browser-specific cause remains unconfirmed; this change removes the client-router dependency for entering and leaving the review page.
