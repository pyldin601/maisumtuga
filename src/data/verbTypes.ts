export type VerbTimeShortName = 'presente' | 'pps' | 'imperfeito';

export type VerbTime = {
  fullName: string;
  shortName: VerbTimeShortName;
};

export type VerbSubject = {
  full: string;
  short: string;
};

export type VerbForm = {
  acceptedAnswers?: readonly string[];
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
  acceptedAnswers: readonly string[];
  correctAnswer: string;
  infinitiveForm: string;
  subjectFull: string;
  subjectShort: string;
  time: VerbTime;
  translations: readonly string[];
};
