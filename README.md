# Mais Um Tuga

Minimal Portuguese verb practice app built with Vite, React, and TypeScript.

The quiz shows one conjugation prompt at a time, for example `vocês/eles/elas + cair / presente`. The user types only the verb form. Correct answers move forward in a small Leitner-style progress state; wrong answers go back to the first box. Progress is stored in `localStorage`.

## Development

```sh
npm run dev -- --host 127.0.0.1
npm run lint
npm run build
```

## Practice Scope

The current verb deck focuses on A2 Portuguese verbs in:

- `presente`
- `P.P.S. - Pretérito Perfeito Simples`

Subjects used:

- `eu`
- `tu`
- `você/ele/ela`
- `nós`
- `vocês/eles/elas`

## Verbs

Verb data covers the complete course list for Units 1-36, plus `trazer`, in both supported tenses.

Verb data is split by conjugation strategy:

- `src/data/a2RegularVerbs.ts` contains regular verbs and regular verb phrases.
- `src/data/a2IrregularVerbs.ts` contains irregular verbs, stem-changing verbs, and phrases based on irregular verbs.

The quiz merges those files and shuffles the combined deck when building a session.

Regular verb inputs support:

- `baseInfinitive` for phrases that conjugate a shorter base verb, such as `andar de`.
- `suffix` for fixed phrase text appended after the conjugated form, such as `a cavalo`.
- `reflexive` for hyphenated reflexive pronouns, such as `chamo-me`.

The regular generator also handles common spelling changes in the first-person singular preterite and present where needed, including `-çar`, `-car`, `-gar`, `-ear`, and `-cer`.

Some adjective phrases use a fixed masculine singular quiz answer, for example `estar perdido` and `ser bom em`.
