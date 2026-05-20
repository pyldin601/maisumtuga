import { createVerbForms } from './verbSubjects.ts';
import type { Verb } from './verbTypes.ts';

export const a2Verbs: Verb[] = [
  {
    infinitive: 'ser',
    translations: ['to be'],
    times: {
      presente: createVerbForms(['sou', 'és', 'é', 'somos', 'são']),
      pps: createVerbForms(['fui', 'foste', 'foi', 'fomos', 'foram']),
    },
  },
  {
    infinitive: 'estar',
    translations: ['to be'],
    times: {
      presente: createVerbForms(['estou', 'estás', 'está', 'estamos', 'estão']),
      pps: createVerbForms(['estive', 'estiveste', 'esteve', 'estivemos', 'estiveram']),
    },
  },
  {
    infinitive: 'ter',
    translations: ['to have'],
    times: {
      presente: createVerbForms(['tenho', 'tens', 'tem', 'temos', 'têm']),
      pps: createVerbForms(['tive', 'tiveste', 'teve', 'tivemos', 'tiveram']),
    },
  },
  {
    infinitive: 'ir',
    translations: ['to go'],
    times: {
      presente: createVerbForms(['vou', 'vais', 'vai', 'vamos', 'vão']),
      pps: createVerbForms(['fui', 'foste', 'foi', 'fomos', 'foram']),
    },
  },
  {
    infinitive: 'fazer',
    translations: ['to do', 'to make'],
    times: {
      presente: createVerbForms(['faço', 'fazes', 'faz', 'fazemos', 'fazem']),
      pps: createVerbForms(['fiz', 'fizeste', 'fez', 'fizemos', 'fizeram']),
    },
  },
  {
    infinitive: 'dizer',
    translations: ['to say', 'to tell'],
    times: {
      presente: createVerbForms(['digo', 'dizes', 'diz', 'dizemos', 'dizem']),
      pps: createVerbForms(['disse', 'disseste', 'disse', 'dissemos', 'disseram']),
    },
  },
  {
    infinitive: 'poder',
    translations: ['can', 'to be able to'],
    times: {
      presente: createVerbForms(['posso', 'podes', 'pode', 'podemos', 'podem']),
      pps: createVerbForms(['pude', 'pudeste', 'pôde', 'pudemos', 'puderam']),
    },
  },
  {
    infinitive: 'querer',
    translations: ['to want'],
    times: {
      presente: createVerbForms(['quero', 'queres', 'quer', 'queremos', 'querem']),
      pps: createVerbForms(['quis', 'quiseste', 'quis', 'quisemos', 'quiseram']),
    },
  },
  {
    infinitive: 'saber',
    translations: ['to know'],
    times: {
      presente: createVerbForms(['sei', 'sabes', 'sabe', 'sabemos', 'sabem']),
      pps: createVerbForms(['soube', 'soubeste', 'soube', 'soubemos', 'souberam']),
    },
  },
  {
    infinitive: 'ver',
    translations: ['to see'],
    times: {
      presente: createVerbForms(['vejo', 'vês', 'vê', 'vemos', 'veem']),
      pps: createVerbForms(['vi', 'viste', 'viu', 'vimos', 'viram']),
    },
  },
  {
    infinitive: 'vir',
    translations: ['to come'],
    times: {
      presente: createVerbForms(['venho', 'vens', 'vem', 'vimos', 'vêm']),
      pps: createVerbForms(['vim', 'vieste', 'veio', 'viemos', 'vieram']),
    },
  },
  {
    infinitive: 'dar',
    translations: ['to give'],
    times: {
      presente: createVerbForms(['dou', 'dás', 'dá', 'damos', 'dão']),
      pps: createVerbForms(['dei', 'deste', 'deu', 'demos', 'deram']),
    },
  },
  {
    infinitive: 'pôr',
    translations: ['to put'],
    times: {
      presente: createVerbForms(['ponho', 'pões', 'põe', 'pomos', 'põem']),
      pps: createVerbForms(['pus', 'puseste', 'pôs', 'pusemos', 'puseram']),
    },
  },
  {
    infinitive: 'cair',
    translations: ['to fall'],
    times: {
      presente: createVerbForms(['caio', 'cais', 'cai', 'caímos', 'caem']),
      pps: createVerbForms(['caí', 'caíste', 'caiu', 'caímos', 'caíram']),
    },
  },
  {
    infinitive: 'trazer',
    translations: ['to bring'],
    times: {
      presente: createVerbForms(['trago', 'trazes', 'traz', 'trazemos', 'trazem']),
      pps: createVerbForms(['trouxe', 'trouxeste', 'trouxe', 'trouxemos', 'trouxeram']),
    },
  },
  {
    infinitive: 'haver',
    translations: ['there to be', 'to exist'],
    notes: 'Mostly used impersonally at A2: há / houve.',
    times: {
      presente: createVerbForms(['hei', 'hás', 'há', 'havemos', 'hão']),
      pps: createVerbForms(['houve', 'houveste', 'houve', 'houvemos', 'houveram']),
    },
  },
  {
    infinitive: 'ler',
    translations: ['to read'],
    times: {
      presente: createVerbForms(['leio', 'lês', 'lê', 'lemos', 'leem']),
      pps: createVerbForms(['li', 'leste', 'leu', 'lemos', 'leram']),
    },
  },
  {
    infinitive: 'ouvir',
    translations: ['to hear', 'to listen'],
    times: {
      presente: createVerbForms(['ouço', 'ouves', 'ouve', 'ouvimos', 'ouvem']),
      pps: createVerbForms(['ouvi', 'ouviste', 'ouviu', 'ouvimos', 'ouviram']),
    },
  },
  {
    infinitive: 'pedir',
    translations: ['to ask for', 'to order'],
    times: {
      presente: createVerbForms(['peço', 'pedes', 'pede', 'pedimos', 'pedem']),
      pps: createVerbForms(['pedi', 'pediste', 'pediu', 'pedimos', 'pediram']),
    },
  },
];
