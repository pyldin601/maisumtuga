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

Verb data is split by kind:

- `src/data/a2RegularVerbs.ts` contains regular verbs, statically ordered by common A2 usage.
- `src/data/a2IrregularVerbs.ts` contains irregular or commonly irregular verbs.

The quiz merges those files without runtime sorting. Regular verbs are placed first so their source order controls the opening session flow.

### Regular

- `falar` - to speak
- `trabalhar` - to work
- `estudar` - to study
- `morar` - to live
- `viver` - to live
- `comprar` - to buy
- `tomar` - to take, to drink
- `comer` - to eat
- `beber` - to drink
- `passar` - to pass, to spend time
- `deixar` - to leave, to let
- `esperar` - to wait, to hope
- `entrar` - to enter
- `usar` - to use
- `ajudar` - to help
- `aprender` - to learn
- `procurar` - to look for
- `receber` - to receive
- `responder` - to answer
- `telefonar` - to phone
- `visitar` - to visit
- `jantar` - to have dinner
- `abrir` - to open
- `assistir` - to watch, to attend
- `decidir` - to decide
- `partir` - to leave, to depart
- `permitir` - to allow
- `vender` - to sell
- `existir` - to exist
- `discutir` - to discuss
- `dividir` - to divide, to share

### Irregular

- `ser` - to be
- `estar` - to be
- `ter` - to have
- `ir` - to go
- `fazer` - to do, to make
- `dizer` - to say, to tell
- `poder` - can, to be able to
- `querer` - to want
- `saber` - to know
- `ver` - to see
- `vir` - to come
- `dar` - to give
- `pôr` - to put
- `cair` - to fall
- `trazer` - to bring
- `haver` - there to be, to exist
- `ler` - to read
- `ouvir` - to hear, to listen
- `pedir` - to ask for, to order
