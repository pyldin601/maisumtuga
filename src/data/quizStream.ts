import { a2RegularVerbs } from './a2RegularVerbs.ts';
import { a2Verbs } from './a2IrregularVerbs.ts';
import { a2VerbTimes } from './verbTime.ts';
import type { Verb, VerbQuizQuestion, VerbTimeShortName } from './verbTypes.ts';
import type { QuizVerbType } from '../state.ts';

function createA2SessionVerbs(verbType: QuizVerbType): Verb[] {
  switch (verbType) {
    case 'regular':
      return [...a2RegularVerbs];
    case 'irregular':
      return [...a2Verbs];
    case 'both':
      return [...a2Verbs, ...a2RegularVerbs];
  }
}

export function createQuizStream(verbType: QuizVerbType): readonly VerbQuizQuestion[] {
  const a2SessionVerbs = createA2SessionVerbs(verbType);
  a2SessionVerbs.sort(() => Math.random() - 0.5);
  return a2SessionVerbs.flatMap((verb) =>
    Object.entries(verb.times).flatMap(([timeShortName, forms]) =>
      forms.map((form) => ({
        correctAnswer: form.form,
        infinitiveForm: verb.infinitive,
        subjectFull: form.subjectFull,
        subjectShort: form.subjectShort,
        time: a2VerbTimes[timeShortName as VerbTimeShortName],
        translations: verb.translations,
      }))
    )
  );
}
