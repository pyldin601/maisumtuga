import { a2VerbSubjects, type A2Verb, type VerbForm } from './a2IrregularVerbs';

type RegularVerbEnding = 'ar' | 'er' | 'ir';

type RegularVerbInput = {
  infinitive: string;
  translations: string[];
};

const regularEndings: Record<RegularVerbEnding, { presente: string[]; pps: string[] }> = {
  ar: {
    presente: ['o', 'as', 'a', 'amos', 'am'],
    pps: ['ei', 'aste', 'ou', 'ámos', 'aram'],
  },
  er: {
    presente: ['o', 'es', 'e', 'emos', 'em'],
    pps: ['i', 'este', 'eu', 'emos', 'eram'],
  },
  ir: {
    presente: ['o', 'es', 'e', 'imos', 'em'],
    pps: ['i', 'iste', 'iu', 'imos', 'iram'],
  },
};

const regularVerbInputs: RegularVerbInput[] = [
  { infinitive: 'falar', translations: ['to speak'] },
  { infinitive: 'trabalhar', translations: ['to work'] },
  { infinitive: 'estudar', translations: ['to study'] },
  { infinitive: 'morar', translations: ['to live'] },
  { infinitive: 'viver', translations: ['to live'] },
  { infinitive: 'comprar', translations: ['to buy'] },
  { infinitive: 'tomar', translations: ['to take', 'to drink'] },
  { infinitive: 'comer', translations: ['to eat'] },
  { infinitive: 'beber', translations: ['to drink'] },
  { infinitive: 'passar', translations: ['to pass', 'to spend time'] },
  { infinitive: 'deixar', translations: ['to leave', 'to let'] },
  { infinitive: 'esperar', translations: ['to wait', 'to hope'] },
  { infinitive: 'entrar', translations: ['to enter'] },
  { infinitive: 'usar', translations: ['to use'] },
  { infinitive: 'ajudar', translations: ['to help'] },
  { infinitive: 'aprender', translations: ['to learn'] },
  { infinitive: 'procurar', translations: ['to look for'] },
  { infinitive: 'receber', translations: ['to receive'] },
  { infinitive: 'responder', translations: ['to answer'] },
  { infinitive: 'telefonar', translations: ['to phone'] },
  { infinitive: 'visitar', translations: ['to visit'] },
  { infinitive: 'jantar', translations: ['to have dinner'] },
  { infinitive: 'abrir', translations: ['to open'] },
  { infinitive: 'assistir', translations: ['to watch', 'to attend'] },
  { infinitive: 'decidir', translations: ['to decide'] },
  { infinitive: 'partir', translations: ['to leave', 'to depart'] },
  { infinitive: 'permitir', translations: ['to allow'] },
  { infinitive: 'vender', translations: ['to sell'] },
  { infinitive: 'existir', translations: ['to exist'] },
  { infinitive: 'discutir', translations: ['to discuss'] },
  { infinitive: 'dividir', translations: ['to divide', 'to share'] },
];

function forms(values: string[]): VerbForm[] {
  return a2VerbSubjects.map((subject, index) => ({
    form: values[index],
    subjectFull: subject.full,
    subjectShort: subject.short,
  }));
}

function getRegularVerbEnding(infinitive: string): RegularVerbEnding {
  const ending = infinitive.slice(-2);

  if (ending === 'ar' || ending === 'er' || ending === 'ir') {
    return ending;
  }

  throw new Error(`Unsupported regular verb ending for ${infinitive}`);
}

function createRegularForms(infinitive: string, time: keyof (typeof regularEndings)[RegularVerbEnding]): VerbForm[] {
  const ending = getRegularVerbEnding(infinitive);
  const stem = infinitive.slice(0, -2);

  return forms(regularEndings[ending][time].map((suffix) => `${stem}${suffix}`));
}

function createRegularVerb({ infinitive, translations }: RegularVerbInput): A2Verb {
  return {
    infinitive,
    translations,
    times: {
      presente: createRegularForms(infinitive, 'presente'),
      pps: createRegularForms(infinitive, 'pps'),
    },
  };
}

export const a2RegularVerbs: A2Verb[] = regularVerbInputs.map(createRegularVerb);
