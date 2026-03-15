# FOR_Jan: Life In Weeks — The Most Sobering Thing You'll Build

> *"You have about 4,000 weeks. What are you doing with them?"*
> That's the question this app asks — not in a preachy way, but by turning your entire life into a grid of tiny boxes.

---

## 1. Project Overview

**Life In Weeks** (thelifespantracker) is a mortality visualizer. You enter your birth date, and the app renders your entire life as a grid of 4,160 small boxes — each one representing one week of your 80 years on Earth. Filled boxes are weeks you've already lived. The current week pulses. The empty boxes are what's left.

It's inspired by Oliver Burkeman's book *"Four Thousand Weeks: Time Management for Mortals"* — the idea being that seeing your life as a finite grid of boxes makes you take time more seriously than any productivity app ever could.

Three views:
1. **Lifetime** — all 4,160 weeks at once. The full picture.
2. **Year view** — just this calendar year's 52 weeks. How far through the year are you?
3. **Monthly view** — a single month, day by day. A calendar of your life.

---

## 2. Technical Architecture

Same Replit full-stack template as BIFL Kitchen — React frontend with a mostly-empty Express backend. All the interesting logic is in the frontend.

```
Browser
  └── React SPA (Vite)
        └── LifeInWeeksPage          ← Orchestrates everything
              ├── useLifeCalculations ← The brain: all math runs here
              ├── WeeksGrid           ← Renders the actual boxes
              ├── StatisticsCards     ← Numbers: weeks lived, % remaining
              ├── AgeInput            ← Birth date picker
              ├── ViewSelector        ← Lifetime / Year / Month tabs
              └── InspirationQuote    ← Rotating motivational quotes

Express Server (barely used)
  └── /health + /api/status endpoints
```

Data flow is simple and linear:

```
User enters birth date
        ↓
useLifeCalculations(birthDate) runs
        ↓
Returns: weeksLived, weeksRemaining, lifePercentage, yearProgress
        ↓
Everything re-renders with fresh numbers
```

---

## 3. Codebase Structure

```
/
├── client/
│   └── src/
│       ├── pages/
│       │   └── life-in-weeks.tsx        ← Main page, holds all state
│       │
│       ├── components/life-in-weeks/
│       │   ├── age-input.tsx            ← Birth date input field
│       │   ├── view-selector.tsx        ← Lifetime/Year/Month tabs + month picker
│       │   ├── statistics-cards.tsx     ← Weeks lived, % life used, year progress
│       │   ├── weeks-grid.tsx           ← The visual grid of boxes (the star)
│       │   └── inspiration-quote.tsx    ← Rotating motivational quotes
│       │
│       ├── hooks/
│       │   └── use-life-calculations.ts ← All the date math
│       │
│       └── index.css                    ← All the visual styles for the grid
│
└── attached_assets/                     ← Screenshots from build sessions
```

---

## 4. The Heart of the App: useLifeCalculations

This custom hook does all the math. It takes a `birthDate` string and returns everything the UI needs:

```typescript
export function useLifeCalculations(birthDate: string) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Tick every second — makes the "current week" indicator live
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return useMemo(() => {
    const totalLifeWeeks = 4160; // 80 years × 52 weeks
    // ... calculate weeksLived, weeksRemaining, lifePercentage, yearProgress
  }, [birthDate, currentTime]);
}
```

Two things worth noting:

**1. It ticks every second.** The current time is stored in React state and updated every 1000ms. This means `useMemo` recomputes every second — and the grid is technically "live." In practice, your current week only changes once a week, so this is overkill. But it means if you stare at it for 7 days straight, the current week box will flip in real time.

**2. Year progress is independent of birth date.** The hook calculates two separate things: personal life progress (needs a birth date) and year-to-date progress (calculated from January 1st regardless of who you are). This lets the statistics cards show year progress even before a birth date is entered.

---

## 5. The WeeksGrid: Rendering 4,160 Boxes

The grid is the visual centrepiece. It renders differently depending on the current view:

**Lifetime view:** Loops from 0 to 4,159. Each box is classified as `lived`, `current`, or `empty` based on `calculations.weeksLived`. Tooltip shows "Year X, Week Y."

**Year view:** 52 boxes. Calculates which week of the year today falls in (`dayOfYear / 7`), then colours everything before it as lived.

**Monthly view:** Shows days of a calendar month in a 7-column grid (one column per day of the week). Empty cells pad the start so days align correctly to Mon/Tue/Wed etc.

Each box is a `<div>` with a class:
- `.lived` → filled/dark (weeks gone)
- `.current` → highlighted (this week)
- `.empty` → unfilled (weeks remaining)

The grid uses CSS Grid with a dynamic `gridTemplateColumns` value that changes based on screen width — the lifetime view shows 52 columns on desktop, 26 on tablet, 20 on mobile.

---

## 6. Technology Choices

### React + TypeScript + Vite
Same stack as BIFL Kitchen. Standard, fast, reliable.

### Custom Hook for All Math
Separating the date calculations into `useLifeCalculations` was the right call. The page component stays clean (just wiring state to child components), and the math is testable and reusable. If you ever wanted to add a "days" view or a "decades" view, you'd just add new return values to the hook.

### Pure CSS for the Grid Boxes
No animation library. The fade-in effect when switching views is done with a `fadeIn` state variable toggled via `setTimeout`:

```typescript
useEffect(() => {
  setFadeIn(false);
  const timer = setTimeout(() => setFadeIn(true), 50);
  return () => clearTimeout(timer);
}, [currentView, selectedMonth]);
```

50ms is barely noticeable, but it's enough for React to flush the DOM change before adding the fade-in class. This is a classic CSS transition trick.

### shadcn/ui + Tailwind
Same as BIFL Kitchen. Consistent stack across projects.

---

## 7. Lessons Learned

### Lesson 1: Separating "What's True Now" from "What the User Provided"
The hook cleanly separates two concerns:
- **Year progress** — independent of user input, always calculable
- **Personal life progress** — requires a birth date

This means the page isn't broken/empty when someone first loads it with no birth date entered. The year progress cards still show useful information. Always think: *what can I show the user before they give me their data?*

### Lesson 2: The setInterval in a Custom Hook Pattern
Using `setInterval` inside a `useEffect` to tick state every second is a well-known React pattern. The important details:
- Always return the cleanup function (`clearInterval`) — otherwise intervals stack up and you get a memory leak
- Store the result in state, not a ref, if you want components to re-render when it changes
- The dependency array `[]` on the effect means the interval is set up once and never recreated

### Lesson 3: Dynamic gridTemplateColumns is Fragile
The `getGridColumns()` function reads `window.innerWidth` directly to decide how many columns to render:

```typescript
if (window.innerWidth < 480) return 'repeat(20, 1fr)';
if (window.innerWidth < 768) return 'repeat(26, 1fr)';
return 'repeat(52, 1fr)';
```

This runs once when the grid renders, not reactively. If the user resizes the window, the grid won't reflow — it's stuck at whatever column count was calculated on initial render. A better approach would be to use the `useIsMobile` hook (which is already imported!) or a `useWindowSize` hook to make this reactive.

### Lesson 4: Hardcoded 80-Year Lifespan
`totalLifeWeeks = 4160` (80 × 52) is hardcoded. There's no way for users to change their expected lifespan. For a future version, a slider letting users set their expected age (60, 70, 80, 90, 100) would make the tool much more personal and honest — not everyone has the same expectation.

### Lesson 5: The "Year View" Label Will Age Poorly
The view selector code shows: `Year ${currentYear} Progress` — which is good. But inside `WeeksGrid`, there's still a comment that says `// Year 2025 view`. Code comments that mention specific years are a smell — they become misleading as time passes. The code itself is fine (it uses `currentDate.getFullYear()` dynamically), but the comments should be updated to be year-agnostic.

---

## 8. War Stories

### The Book That Started It
This app exists because of Oliver Burkeman's *Four Thousand Weeks*. The core insight of the book is brutal in the best way: you don't have infinite time, you have roughly 4,000 weeks, and most productivity advice is designed to help you fit more into that time — which is the wrong goal. The right goal is to consciously choose what those weeks are *for*.

Building a tool that visualises this idea concretely (not as a metaphor, but as an actual grid of boxes you can stare at) is one of those projects where the subject matter *is* the motivation.

---

## 9. Authentication & Data Persistence (March 2026)

### The Problem
Every page refresh wiped all your data — birth date, people, experiences, gone. The original Express backend with Passport/Drizzle/Neon was scaffolded but never wired up.

### The Solution: Supabase
Instead of building out the unused Express backend, we went with **Supabase** — it runs entirely client-side (no deployment changes needed), provides both auth and PostgreSQL in one service, and the app stays fully usable without signing in.

### How It Works

```
User opens app (no sign-in required — everything works as before)
        ↓
User clicks "Sign In" → AuthDialog appears
        ↓
Signs in with email/password (Google/Apple OAuth ready but not configured yet)
        ↓
useSupabaseSync loads their data from the `user_data` table
        ↓
React state gets hydrated with saved birth_date, people, custom_experiences
        ↓
Any state change triggers a debounced save (1500ms) back to Supabase
        ↓
Save indicator shows "Saving…" → "Saved" in the nav bar
```

### Architecture

- **Supabase Auth** handles sign-in/sign-up/sessions (JWT-based, no server needed)
- **`user_data` table** stores one row per user with `birth_date` (TEXT), `people` (JSONB), `custom_experiences` (JSONB)
- **Row Level Security (RLS)** ensures users can only read/write their own row
- **`isHydratingRef`** prevents the save-on-load loop (loading data from DB would trigger a "state changed, save!" cycle without it)

### New Files

| File | Purpose |
|------|---------|
| `client/src/lib/supabase.ts` | Supabase client init, graceful fallback when env vars missing |
| `client/src/contexts/AuthContext.tsx` | Auth state + methods (signIn, signUp, signOut) |
| `client/src/hooks/useAuth.ts` | Thin `useContext(AuthContext)` wrapper |
| `client/src/hooks/use-supabase-sync.ts` | Load on login, debounced save on change, clear on logout |
| `client/src/components/auth/AuthButton.tsx` | "Sign In" button / avatar dropdown in nav |
| `client/src/components/auth/AuthDialog.tsx` | Sign-in modal (Google, Apple, email/password) |
| `client/src/components/auth/SaveIndicator.tsx` | "Saving…" / "Saved" / "Failed to save" indicator |
| `supabase/migrations/20260315_create_user_data.sql` | Database migration for the user_data table + RLS |

### Key Design Decisions

1. **Single JSONB columns** — `people` and `custom_experiences` are stored as JSONB arrays, not separate tables. This keeps queries simple (one row per user, one read, one write) and maps 1:1 to the React state structure.

2. **Debounced saves (1500ms)** — Typing a birth date or toggling experiences fires rapid state changes. The debounce waits for the user to stop making changes before hitting Supabase.

3. **No server changes** — The Express backend remains untouched. Supabase client library talks directly to the Supabase API. The app is still a static SPA on Vercel.

4. **Graceful degradation** — If Supabase isn't configured (no env vars), the auth button simply doesn't render. The app works exactly as before.

### Environment Setup

- **Local:** `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (gitignored)
- **Vercel:** Same two env vars added via `vercel env add`
- **Supabase project:** `lifespan-tracker` in Oceania (Sydney) region, linked via Supabase CLI

### What's Next

- Google OAuth (needs Google Cloud Console OAuth credentials)
- Apple Sign-In (needs Apple Developer Account, $99/yr)
- B2: Dead code cleanup — remove the unused `server/`, Passport, Drizzle, Neon deps

---

## Quick Reference

| File | What it does |
|------|-------------|
| `client/src/hooks/use-life-calculations.ts` | All date math — weeksLived, lifePercentage, yearProgress |
| `client/src/components/life-in-weeks/weeks-grid.tsx` | The box grid — the visual centrepiece |
| `client/src/pages/life-in-weeks.tsx` | Main page, holds birthDate + currentView state |
| `client/src/index.css` | Grid box styles (.lived, .current, .empty) |
| `client/src/lib/supabase.ts` | Supabase client init |
| `client/src/contexts/AuthContext.tsx` | Auth context provider |
| `client/src/hooks/use-supabase-sync.ts` | Data sync with Supabase |

**To change the assumed lifespan:** Update `totalLifeWeeks = 4160` in `use-life-calculations.ts` (and `WeeksGrid.tsx` which has its own copy of `totalLifeWeeks = 4160`).

**To add a new view:** Add it to the `ViewMode` type in `life-in-weeks.tsx`, add a tab in `ViewSelector`, and add a render function in `WeeksGrid`.

**To add a new auth provider:** Enable it in Supabase Dashboard → Authentication → Providers, then add a button in `AuthDialog.tsx` calling `supabase.auth.signInWithOAuth({ provider: 'new_provider' })`.

---

*Built with React + TypeScript + Vite + shadcn/ui + Tailwind + Supabase. Inspired by Oliver Burkeman's Four Thousand Weeks.*
