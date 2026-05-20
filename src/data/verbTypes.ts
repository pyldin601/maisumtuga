export type VerbTimeShortName = 'presente' | 'pps';

export type VerbTime = {
  fullName: string;
  shortName: VerbTimeShortName;
};

export type VerbSubject = {
  full: string;
  short: string;
};

export type VerbForm = {
  form: string;
  subjectFull: string;
  subjectShort: string;
};

export type Verb = {
  infinitive: string;
  notes?: string;
  times: Record<VerbTimeShortName, VerbForm[]>;
  translations: string[];
};

export type VerbQuizQuestion = {
  correctAnswer: string;
  infinitiveForm: string;
  subjectFull: string;
  subjectShort: string;
  time: VerbTime;
  translations: readonly string[];
};
