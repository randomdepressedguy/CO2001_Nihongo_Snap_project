# Nihongo Snap — Japanese study website

A focused Japanese vocabulary website with an original vintage Japanese visual identity, a standard homepage and separate pages for Flashcards (`/cards`), Notebook (`/notebook`), Review (`/review`) and Dictionary (`/dictionary`). Built with React 19, TypeScript, Vinext/Vite, Cloudflare Workers and D1. No Lovable dependency.

## Everyday use
1. Browse the 123-entry curated Dictionary, inspect readings and examples, and save words into a deck.
2. Create decks and add or edit vocabulary, notes and favorites in Notebook.
3. Review due words through flashcards, meaning choices, typed readings or listening. Again/Hard/Good/Easy update the next interval. Incorrect quiz answers must be relearned; failed words return once per session.
4. Use free practice to study without changing review dates. Sessions include up to 30 initial words.
5. Register with an email identifier and password, or continue as a local guest. Account data automatically synchronizes with D1. The Account page manages display name, password, synchronization and importing previous device vocabulary.
6. Export JSON from Notebook, Settings or Account. Notebook import merges words without resetting existing notes or schedules. Settings Restore replaces the entire state after a warning.

## Run and verify
Requires Node >=22.13 and the pnpm version in package.json.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm typecheck
pnpm build
```

See RUNTIME.md for the supplied runtime and local D1 migration workflow. Keep platform authentication middleware intact. The deployed Site retains its private access gate; app accounts are an additional data identity within that gate. Other hosts need an equivalent database adapter and correctly configured HTTPS/origins.

## Accounts and persistence
- `/register`, `/login` and protected `/account` are real pages. Passwords use salted scrypt (N=32768, r=8, p=3). Random session tokens are stored as SHA-256 digests, with HttpOnly/SameSite=Lax cookies and Secure cookies in production.
- Mutations enforce same-origin requests and body limits. Sign-in, registration and password changes have D1-backed rate limits. Password updates revoke previous sessions. Authentication responses are not cached.
- Google OAuth, email verification and password-reset email are not configured. The interface states this explicitly. Email is a login identifier; use a unique password and retain it securely.
- IndexedDB caches state per app account, or previous platform/guest identity. Original guest data remains available through an explicit import from Account. Invalid cache data blocks autosave to preserve recovery options.
- Account changes autosave locally and synchronize after a short debounce. Atomic cache metadata retains pending edits and base revisions. D1 optimistic revisions reject conflicting writes; the local copy is preserved with a visible conflict banner. Export it before loading the server copy. Importing words does not overwrite existing words/notes, so inspect the exported backup when reconciling changes to the same word.
- Version 2 backups retain old lesson/chat fields. Those former modules remain in source for historical compatibility but are not imported by the focused UI.
- No cross-tab local merge or service worker. Use one editing tab. Already loaded content can work without a network; cold opening requires the site. TTS depends on an installed Japanese device voice. Completed review answers persist, but an unfinished session queue is not resumed after reload.

## Structure
- `app/`: actual page routes and HTTP APIs
- `components/study/App.tsx`: shared header, navigation, footer and feature shell
- `Home.tsx`, `Auth.tsx`, `Account.tsx`: homepage and account interface
- `Vocabulary.tsx`, `FocusReview.tsx`, `StudySettings.tsx`: four learning tools and preferences
- `context.tsx`: per-account cache, autosync, notifications and device speech
- `lib/study/`: state validation, scheduling, imports and revision storage
- `lib/auth/`: password hashing, session identity, validation and account actions
- `db/` and `drizzle/`: D1 schema and versioned migrations

The 123 entries are a compact starter dictionary, not a comprehensive JLPT syllabus. Entries include authored examples and Vietnamese/English meanings. Interface copy uses direct, objective labels. See ASSETS.md for the original Fuji artwork, and QA_NOTES.md for validation and remaining limits.
