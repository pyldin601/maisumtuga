import type { VerbForm, VerbSubject } from './verbTypes.ts';

export const a2VerbSubjects: VerbSubject[] = [
  { full: 'eu', short: 'eu' },
  { full: 'tu', short: 'tu' },
  { full: 'você/ele/ela', short: 'voce' },
  { full: 'nós', short: 'nos' },
  { full: 'vocês/eles/elas', short: 'voces' },
];

export const a2ImperativeVerbSubjects: VerbSubject[] = [
  { full: 'tu', short: 'tu' },
  { full: 'você', short: 'voce' },
  { full: 'nós', short: 'nos' },
  { full: 'vocês', short: 'voces' },
];

export function createVerbForms(values: string[], subjects = a2VerbSubjects): VerbForm[] {
  return subjects.map((subject, index) => ({
    form: values[index],
    subjectFull: subject.full,
    subjectShort: subject.short,
  }));
}

export function createImperativeVerbForms(values: string[]): VerbForm[] {
  return createVerbForms(values, a2ImperativeVerbSubjects);
}
