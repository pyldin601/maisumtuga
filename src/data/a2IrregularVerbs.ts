import { createVerbForms } from './verbSubjects.ts';
import type { Verb } from './verbTypes.ts';

const reflexivePronouns = ['-me', '-te', '-se', '-nos', '-se'];

type CustomVerbInput = {
  acceptedPps?: string[];
  acceptedPresente?: string[];
  infinitive: string;
  translations: string[];
  presente: string[];
  pps: string[];
  notes?: string;
};

function addAcceptedAnswers(
  forms: ReturnType<typeof createVerbForms>,
  acceptedAnswers?: string[]
): ReturnType<typeof createVerbForms> {
  if (!acceptedAnswers) {
    return forms;
  }

  return forms.map((form, index) => ({
    ...form,
    acceptedAnswers: acceptedAnswers[index] ? [acceptedAnswers[index]] : [],
  }));
}

function createCustomVerb({
  acceptedPps,
  acceptedPresente,
  infinitive,
  translations,
  presente,
  pps,
  notes,
}: CustomVerbInput): Verb {
  return {
    infinitive,
    translations,
    notes,
    times: {
      presente: addAcceptedAnswers(createVerbForms(presente), acceptedPresente),
      pps: addAcceptedAnswers(createVerbForms(pps), acceptedPps),
    },
  };
}

function withSuffix(forms: string[], suffix: string | string[]): string[] {
  return forms.map((form, index) => `${form} ${Array.isArray(suffix) ? suffix[index] : suffix}`);
}

function withReflexive(forms: string[]): string[] {
  return forms.map((form, index) => {
    const conjugatedForm = index === 3 ? form.slice(0, -1) : form;

    return `${conjugatedForm}${reflexivePronouns[index]}`;
  });
}

const serPresente = ['sou', 'és', 'é', 'somos', 'são'];
const serPps = ['fui', 'foste', 'foi', 'fomos', 'foram'];
const estarPresente = ['estou', 'estás', 'está', 'estamos', 'estão'];
const estarPps = ['estive', 'estiveste', 'esteve', 'estivemos', 'estiveram'];
const terPresente = ['tenho', 'tens', 'tem', 'temos', 'têm'];
const terPps = ['tive', 'tiveste', 'teve', 'tivemos', 'tiveram'];
const terDePresente = withSuffix(terPresente, 'de');
const terDePps = withSuffix(terPps, 'de');
const terQuePresente = withSuffix(terPresente, 'que');
const terQuePps = withSuffix(terPps, 'que');
const irPresente = ['vou', 'vais', 'vai', 'vamos', 'vão'];
const irPps = serPps;
const fazerPresente = ['faço', 'fazes', 'faz', 'fazemos', 'fazem'];
const fazerPps = ['fiz', 'fizeste', 'fez', 'fizemos', 'fizeram'];
const porPresente = ['ponho', 'pões', 'põe', 'pomos', 'põem'];
const porPps = ['pus', 'puseste', 'pôs', 'pusemos', 'puseram'];
const pedirPresente = ['peço', 'pedes', 'pede', 'pedimos', 'pedem'];
const pedirPps = ['pedi', 'pediste', 'pediu', 'pedimos', 'pediram'];
const defaultBomEm = ['bom em', 'bom em', 'bom em', 'bons em', 'bons em'];
const defaultPerdido = ['perdido', 'perdido', 'perdido', 'perdidos', 'perdidos'];
const defaultVestido = ['vestido', 'vestido', 'vestido', 'vestidos', 'vestidos'];

export const a2Verbs: Verb[] = [
  createCustomVerb({
    infinitive: 'ser',
    translations: ['to be'],
    presente: serPresente,
    pps: serPps,
  }),
  createCustomVerb({
    infinitive: 'ser bom em',
    translations: ['to be good at'],
    presente: withSuffix(serPresente, defaultBomEm),
    pps: withSuffix(serPps, defaultBomEm),
    notes: 'Uses masculine default adjective forms in quiz answers.',
  }),
  createCustomVerb({
    infinitive: 'estar',
    translations: ['to be'],
    presente: estarPresente,
    pps: estarPps,
  }),
  createCustomVerb({
    infinitive: 'estar perdido',
    translations: ['to be lost'],
    presente: withSuffix(estarPresente, defaultPerdido),
    pps: withSuffix(estarPps, defaultPerdido),
    notes: 'Uses masculine default adjective forms in quiz answers.',
  }),
  createCustomVerb({
    infinitive: 'estar vestido',
    translations: ['to be dressed'],
    presente: withSuffix(estarPresente, defaultVestido),
    pps: withSuffix(estarPps, defaultVestido),
    notes: 'Uses masculine default adjective forms in quiz answers.',
  }),
  createCustomVerb({
    infinitive: 'ter',
    translations: ['to have'],
    presente: terPresente,
    pps: terPps,
  }),
  createCustomVerb({
    infinitive: 'ter interesse em',
    translations: ['to be interested in'],
    presente: withSuffix(terPresente, 'interesse em'),
    pps: withSuffix(terPps, 'interesse em'),
  }),
  createCustomVerb({
    infinitive: 'ter de/que',
    translations: ['to have to'],
    presente: terDePresente,
    pps: terDePps,
    acceptedPresente: terQuePresente,
    acceptedPps: terQuePps,
  }),
  createCustomVerb({
    infinitive: 'ter saudades',
    translations: ['to miss', 'to feel longing'],
    presente: withSuffix(terPresente, 'saudades'),
    pps: withSuffix(terPps, 'saudades'),
  }),
  createCustomVerb({
    infinitive: 'ter medo',
    translations: ['to be afraid'],
    presente: withSuffix(terPresente, 'medo'),
    pps: withSuffix(terPps, 'medo'),
  }),
  createCustomVerb({
    infinitive: 'ir',
    translations: ['to go'],
    presente: irPresente,
    pps: irPps,
  }),
  createCustomVerb({
    infinitive: 'ir buscar',
    translations: ['to fetch'],
    presente: withSuffix(irPresente, 'buscar'),
    pps: withSuffix(irPps, 'buscar'),
  }),
  createCustomVerb({
    infinitive: 'ir-se embora',
    translations: ['to leave', 'to go away'],
    presente: withSuffix(withReflexive(irPresente), 'embora'),
    pps: withSuffix(withReflexive(irPps), 'embora'),
  }),
  createCustomVerb({
    infinitive: 'fazer',
    translations: ['to do', 'to make'],
    presente: fazerPresente,
    pps: fazerPps,
  }),
  createCustomVerb({
    infinitive: 'fazer anos',
    translations: ['to have a birthday'],
    presente: withSuffix(fazerPresente, 'anos'),
    pps: withSuffix(fazerPps, 'anos'),
  }),
  createCustomVerb({
    infinitive: 'fazer campismo',
    translations: ['to camp'],
    presente: withSuffix(fazerPresente, 'campismo'),
    pps: withSuffix(fazerPps, 'campismo'),
  }),
  createCustomVerb({
    infinitive: 'fazer esqui',
    translations: ['to ski'],
    presente: withSuffix(fazerPresente, 'esqui'),
    pps: withSuffix(fazerPps, 'esqui'),
  }),
  createCustomVerb({
    infinitive: 'fazer mergulho',
    translations: ['to dive'],
    presente: withSuffix(fazerPresente, 'mergulho'),
    pps: withSuffix(fazerPps, 'mergulho'),
  }),
  createCustomVerb({
    infinitive: 'dizer',
    translations: ['to say', 'to tell'],
    presente: ['digo', 'dizes', 'diz', 'dizemos', 'dizem'],
    pps: ['disse', 'disseste', 'disse', 'dissemos', 'disseram'],
  }),
  createCustomVerb({
    infinitive: 'poder',
    translations: ['can', 'to be able to'],
    presente: ['posso', 'podes', 'pode', 'podemos', 'podem'],
    pps: ['pude', 'pudeste', 'pôde', 'pudemos', 'puderam'],
  }),
  createCustomVerb({
    infinitive: 'querer',
    translations: ['to want'],
    presente: ['quero', 'queres', 'quer', 'queremos', 'querem'],
    pps: ['quis', 'quiseste', 'quis', 'quisemos', 'quiseram'],
  }),
  createCustomVerb({
    infinitive: 'saber',
    translations: ['to know'],
    presente: ['sei', 'sabes', 'sabe', 'sabemos', 'sabem'],
    pps: ['soube', 'soubeste', 'soube', 'soubemos', 'souberam'],
  }),
  createCustomVerb({
    infinitive: 'ver',
    translations: ['to see'],
    presente: ['vejo', 'vês', 'vê', 'vemos', 'veem'],
    pps: ['vi', 'viste', 'viu', 'vimos', 'viram'],
  }),
  createCustomVerb({
    infinitive: 'vir',
    translations: ['to come'],
    presente: ['venho', 'vens', 'vem', 'vimos', 'vêm'],
    pps: ['vim', 'vieste', 'veio', 'viemos', 'vieram'],
  }),
  createCustomVerb({
    infinitive: 'dar',
    translations: ['to give'],
    presente: ['dou', 'dás', 'dá', 'damos', 'dão'],
    pps: ['dei', 'deste', 'deu', 'demos', 'deram'],
  }),
  createCustomVerb({
    infinitive: 'pôr',
    translations: ['to put'],
    presente: porPresente,
    pps: porPps,
  }),
  createCustomVerb({
    infinitive: 'pôr a mesa',
    translations: ['to set the table'],
    presente: withSuffix(porPresente, 'a mesa'),
    pps: withSuffix(porPps, 'a mesa'),
  }),
  createCustomVerb({
    infinitive: 'cair',
    translations: ['to fall'],
    presente: ['caio', 'cais', 'cai', 'caímos', 'caem'],
    pps: ['caí', 'caíste', 'caiu', 'caímos', 'caíram'],
  }),
  createCustomVerb({
    infinitive: 'sair',
    translations: ['to leave', 'to go out'],
    presente: ['saio', 'sais', 'sai', 'saímos', 'saem'],
    pps: ['saí', 'saíste', 'saiu', 'saímos', 'saíram'],
  }),
  createCustomVerb({
    infinitive: 'trazer',
    translations: ['to bring'],
    presente: ['trago', 'trazes', 'traz', 'trazemos', 'trazem'],
    pps: ['trouxe', 'trouxeste', 'trouxe', 'trouxemos', 'trouxeram'],
  }),
  createCustomVerb({
    infinitive: 'ler',
    translations: ['to read'],
    presente: ['leio', 'lês', 'lê', 'lemos', 'leem'],
    pps: ['li', 'leste', 'leu', 'lemos', 'leram'],
  }),
  createCustomVerb({
    infinitive: 'ouvir',
    translations: ['to hear', 'to listen'],
    presente: ['ouço', 'ouves', 'ouve', 'ouvimos', 'ouvem'],
    pps: ['ouvi', 'ouviste', 'ouviu', 'ouvimos', 'ouviram'],
  }),
  createCustomVerb({
    infinitive: 'pedir',
    translations: ['to ask for', 'to order'],
    presente: pedirPresente,
    pps: pedirPps,
  }),
  createCustomVerb({
    infinitive: 'pedir emprestado',
    translations: ['to borrow'],
    presente: withSuffix(pedirPresente, 'emprestado'),
    pps: withSuffix(pedirPps, 'emprestado'),
  }),
  createCustomVerb({
    infinitive: 'conhecer',
    translations: ['to know', 'to meet'],
    presente: ['conheço', 'conheces', 'conhece', 'conhecemos', 'conhecem'],
    pps: ['conheci', 'conheceste', 'conheceu', 'conhecemos', 'conheceram'],
  }),
  createCustomVerb({
    infinitive: 'preferir',
    translations: ['to prefer'],
    presente: ['prefiro', 'preferes', 'prefere', 'preferimos', 'preferem'],
    pps: ['preferi', 'preferiste', 'preferiu', 'preferimos', 'preferiram'],
  }),
  createCustomVerb({
    infinitive: 'conduzir',
    translations: ['to drive'],
    presente: ['conduzo', 'conduzes', 'conduz', 'conduzimos', 'conduzem'],
    pps: ['conduzi', 'conduziste', 'conduziu', 'conduzimos', 'conduziram'],
  }),
  createCustomVerb({
    infinitive: 'dormir',
    translations: ['to sleep'],
    presente: ['durmo', 'dormes', 'dorme', 'dormimos', 'dormem'],
    pps: ['dormi', 'dormiste', 'dormiu', 'dormimos', 'dormiram'],
  }),
  createCustomVerb({
    infinitive: 'divertir-se',
    translations: ['to have fun'],
    presente: withReflexive(['divirto', 'divertes', 'diverte', 'divertimos', 'divertem']),
    pps: withReflexive(['diverti', 'divertiste', 'divertiu', 'divertimos', 'divertiram']),
  }),
  createCustomVerb({
    infinitive: 'conseguir',
    translations: ['to manage', 'to be able to'],
    presente: ['consigo', 'consegues', 'consegue', 'conseguimos', 'conseguem'],
    pps: ['consegui', 'conseguiste', 'conseguiu', 'conseguimos', 'conseguiram'],
  }),
  createCustomVerb({
    infinitive: 'descobrir',
    translations: ['to discover'],
    presente: ['descubro', 'descobres', 'descobre', 'descobrimos', 'descobrem'],
    pps: ['descobri', 'descobriste', 'descobriu', 'descobrimos', 'descobriram'],
  }),
  createCustomVerb({
    infinitive: 'sentir-se',
    translations: ['to feel'],
    presente: withReflexive(['sinto', 'sentes', 'sente', 'sentimos', 'sentem']),
    pps: withReflexive(['senti', 'sentiste', 'sentiu', 'sentimos', 'sentiram']),
  }),
  createCustomVerb({
    infinitive: 'servir',
    translations: ['to serve'],
    presente: ['sirvo', 'serves', 'serve', 'servimos', 'servem'],
    pps: ['servi', 'serviste', 'serviu', 'servimos', 'serviram'],
  }),
  createCustomVerb({
    infinitive: 'subir',
    translations: ['to go up'],
    presente: ['subo', 'sobes', 'sobe', 'subimos', 'sobem'],
    pps: ['subi', 'subiste', 'subiu', 'subimos', 'subiram'],
  }),
  createCustomVerb({
    infinitive: 'sentir a falta',
    translations: ['to miss'],
    presente: withSuffix(['sinto', 'sentes', 'sente', 'sentimos', 'sentem'], 'a falta'),
    pps: withSuffix(['senti', 'sentiste', 'sentiu', 'sentimos', 'sentiram'], 'a falta'),
  }),
  createCustomVerb({
    infinitive: 'despedir-se',
    translations: ['to say goodbye'],
    presente: withReflexive(['despeço', 'despedes', 'despede', 'despedimos', 'despedem']),
    pps: withReflexive(['despedi', 'despediste', 'despediu', 'despedimos', 'despediram']),
  }),
  createCustomVerb({
    infinitive: 'despir',
    translations: ['to undress', 'to take off clothes'],
    presente: ['dispo', 'despes', 'despe', 'despimos', 'despem'],
    pps: ['despi', 'despiste', 'despiu', 'despimos', 'despiram'],
  }),
  createCustomVerb({
    infinitive: 'despir-se',
    translations: ['to get undressed'],
    presente: withReflexive(['dispo', 'despes', 'despe', 'despimos', 'despem']),
    pps: withReflexive(['despi', 'despiste', 'despiu', 'despimos', 'despiram']),
  }),
  createCustomVerb({
    infinitive: 'vestir',
    translations: ['to wear', 'to dress'],
    presente: ['visto', 'vestes', 'veste', 'vestimos', 'vestem'],
    pps: ['vesti', 'vestiste', 'vestiu', 'vestimos', 'vestiram'],
  }),
  createCustomVerb({
    infinitive: 'vestir-se',
    translations: ['to get dressed'],
    presente: withReflexive(['visto', 'vestes', 'veste', 'vestimos', 'vestem']),
    pps: withReflexive(['vesti', 'vestiste', 'vestiu', 'vestimos', 'vestiram']),
  }),
  createCustomVerb({
    infinitive: 'morrer',
    translations: ['to die'],
    presente: ['morro', 'morres', 'morre', 'morremos', 'morrem'],
    pps: ['morri', 'morreste', 'morreu', 'morremos', 'morreram'],
  }),
  createCustomVerb({
    infinitive: 'fugir',
    translations: ['to flee', 'to run away'],
    presente: ['fujo', 'foges', 'foge', 'fugimos', 'fogem'],
    pps: ['fugi', 'fugiste', 'fugiu', 'fugimos', 'fugiram'],
  }),
  createCustomVerb({
    infinitive: 'seguir',
    translations: ['to follow'],
    presente: ['sigo', 'segues', 'segue', 'seguimos', 'seguem'],
    pps: ['segui', 'seguiste', 'seguiu', 'seguimos', 'seguiram'],
  }),
];
