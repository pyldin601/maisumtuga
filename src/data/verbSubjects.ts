import type { VerbForm, VerbSubject } from './verbTypes.ts';

export const a2VerbSubjects: VerbSubject[] = [
  { full: 'eu', short: 'eu' },
  { full: 'tu', short: 'tu' },
  { full: 'você/ele/ela', short: 'voce' },
  { full: 'nós', short: 'nos' },
  { full: 'vocês/eles/elas', short: 'voces' },
];

export function createVerbForms(values: string[]): VerbForm[] {
  return a2VerbSubjects.map((subject, index) => ({
    form: values[index],
    subjectFull: subject.full,
    subjectShort: subject.short,
  }));
}
