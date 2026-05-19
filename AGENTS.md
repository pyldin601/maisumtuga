# AGENTS.md

## Project

This is a Vite + React + TypeScript app for practicing Portuguese verb conjugation.

The product direction is minimal, quiet, and focused. Avoid dashboard-like UI unless explicitly requested. The first screen should remain the actual quiz experience, not a landing page.

## Commands

- Run lint: `npm run lint`
- Run build: `npm run build`
- Run dev server: `npm run dev -- --host 127.0.0.1`
- Format all files: `npm run format`

Run `npm run lint` and `npm run build` after code changes.

## Architecture Notes

- `src/App.tsx` should stay thin. It renders the page shell and `VerbQuizSession`.
- `src/components/quiz/VerbQuizSession/` owns the quiz session orchestration:
  - building the verb question stream
  - filtering due questions from Leitner progress
  - updating Leitner progress on correct/wrong answers
  - session continuation
  - row positioning for the session stream
- `useVerbQuizSession` should stay pure session state. Do not put `localStorage` or Leitner persistence in this hook.
- `VerbQuiz` should stay focused on a single prompt/input interaction.
- `src/state.ts` owns Leitner storage behavior.

## Session Flow

- A session starts from a frozen list of due questions.
- The current testing limit may change, but the intended product session size is 60 questions.
- Resolving an answer and showing the next question are separate steps:
  - `resolveCorrectQuestion` / `resolveWrongQuestion` mark the current answer.
  - `showNextQuestion` appends the next pending answer after the UI delay.
- Keep animation timing in the component layer, not inside the pure hook.

## UI Conventions

- Keep the interface white-on-black, restrained, and typographic.
- Prefer Portuguese UI text for learner-facing messages.
- Avoid adding stats or extra chrome unless asked. If stats are added later, keep them subtle.
- Mobile keyboard stability matters. Avoid disabling focused inputs if `readOnly` works.

## Git Hygiene

- Do not commit unrelated changes together.
- If the working tree is dirty, inspect scope before staging.
- Prefer focused commit messages that describe the user-visible or architectural change.
