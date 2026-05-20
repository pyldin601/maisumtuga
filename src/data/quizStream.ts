import { a2RegularVerbs } from './a2RegularVerbs.ts';
import { a2Verbs } from './a2IrregularVerbs.ts';
import { a2VerbTimes } from './verbTime.ts';
import type { VerbQuizQuestion, VerbTimeShortName } from './verbTypes.ts';

export function createQuizStream(): readonly VerbQuizQuestion[] {
  const a2SessionVerbs = [...a2Verbs, ...a2RegularVerbs];
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
