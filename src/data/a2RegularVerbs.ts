import { createVerbForms } from './verbSubjects.ts';
import type { Verb, VerbForm, VerbTimeShortName } from './verbTypes.ts';

type RegularVerbEnding = 'ar' | 'er' | 'ir';

type RegularVerbInput = {
  infinitive: string;
  translations: string[];
  baseInfinitive?: string;
  suffix?: string | string[];
  reflexive?: boolean;
};

const reflexivePronouns = ['-me', '-te', '-se', '-nos', '-se'];

const regularEndings: Record<RegularVerbEnding, Record<VerbTimeShortName, string[]>> = {
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
  { infinitive: 'chamar-se', baseInfinitive: 'chamar', reflexive: true, translations: ['to be called'] },
  { infinitive: 'falar', translations: ['to speak'] },
  { infinitive: 'morar', translations: ['to live'] },
  { infinitive: 'gostar', translations: ['to like'] },
  { infinitive: 'achar', translations: ['to think', 'to find'] },
  { infinitive: 'estudar', translations: ['to study'] },
  { infinitive: 'ganhar', translations: ['to earn', 'to win'] },
  { infinitive: 'trabalhar', translations: ['to work'] },
  { infinitive: 'usar', translations: ['to use'] },
  { infinitive: 'viajar', translations: ['to travel'] },
  { infinitive: 'andar', translations: ['to walk', 'to ride'] },
  { infinitive: 'casar', translations: ['to marry'] },
  { infinitive: 'cantar', translations: ['to sing'] },
  { infinitive: 'cozinhar', translations: ['to cook'] },
  { infinitive: 'dançar', translations: ['to dance'] },
  { infinitive: 'adorar', translations: ['to love', 'to adore'] },
  { infinitive: 'detestar', translations: ['to hate'] },
  { infinitive: 'jogar', translations: ['to play'] },
  { infinitive: 'passar', translations: ['to pass', 'to spend time'] },
  { infinitive: 'almoçar', translations: ['to have lunch'] },
  { infinitive: 'andar de', baseInfinitive: 'andar', suffix: 'de', translations: ['to ride', 'to go by'] },
  { infinitive: 'apanhar', translations: ['to catch', 'to pick up'] },
  { infinitive: 'estacionar', translations: ['to park'] },
  { infinitive: 'jantar', translations: ['to have dinner'] },
  { infinitive: 'pagar', translations: ['to pay'] },
  { infinitive: 'procurar', translations: ['to look for'] },
  { infinitive: 'tomar', translations: ['to take', 'to drink'] },
  { infinitive: 'acabar', translations: ['to finish'] },
  { infinitive: 'começar', translations: ['to start', 'to begin'] },
  { infinitive: 'durar', translations: ['to last'] },
  { infinitive: 'faltar', translations: ['to be missing'] },
  { infinitive: 'acordar', translations: ['to wake up'] },
  { infinitive: 'chegar', translations: ['to arrive'] },
  { infinitive: 'deitar-se', baseInfinitive: 'deitar', reflexive: true, translations: ['to go to bed'] },
  { infinitive: 'encontrar-se', baseInfinitive: 'encontrar', reflexive: true, translations: ['to meet up'] },
  { infinitive: 'levantar-se', baseInfinitive: 'levantar', reflexive: true, translations: ['to get up'] },
  { infinitive: 'levar', translations: ['to take', 'to carry'] },
  { infinitive: 'limpar', translations: ['to clean'] },
  { infinitive: 'visitar', translations: ['to visit'] },
  { infinitive: 'voltar', translations: ['to return'] },
  { infinitive: 'beber', translations: ['to drink'] },
  { infinitive: 'comer', translations: ['to eat'] },
  { infinitive: 'correr', translations: ['to run'] },
  { infinitive: 'descansar', translations: ['to rest'] },
  { infinitive: 'esquecer-se', baseInfinitive: 'esquecer', reflexive: true, translations: ['to forget'] },
  { infinitive: 'lembrar-se', baseInfinitive: 'lembrar', reflexive: true, translations: ['to remember'] },
  { infinitive: 'viver', translations: ['to live'] },
  { infinitive: 'desligar', translations: ['to turn off'] },
  { infinitive: 'sentar-se', baseInfinitive: 'sentar', reflexive: true, translations: ['to sit down'] },
  { infinitive: 'comprar', translations: ['to buy'] },
  { infinitive: 'acender', translations: ['to light', 'to turn on'] },
  { infinitive: 'apagar', translations: ['to erase', 'to turn off'] },
  { infinitive: 'carregar', translations: ['to load', 'to press'] },
  { infinitive: 'gastar', translations: ['to spend'] },
  { infinitive: 'ligar', translations: ['to turn on', 'to call'] },
  { infinitive: 'nadar', translations: ['to swim'] },
  { infinitive: 'pintar', translations: ['to paint'] },
  { infinitive: 'poupar', translations: ['to save'] },
  { infinitive: 'precisar', translations: ['to need'] },
  { infinitive: 'tirar', translations: ['to take out', 'to remove'] },
  { infinitive: 'tocar', translations: ['to touch', 'to play music'] },
  { infinitive: 'aprender', translations: ['to learn'] },
  { infinitive: 'atender', translations: ['to answer', 'to serve'] },
  { infinitive: 'atravessar', translations: ['to cross'] },
  { infinitive: 'deixar', translations: ['to leave', 'to let'] },
  { infinitive: 'ensinar', translations: ['to teach'] },
  { infinitive: 'enviar', translations: ['to send'] },
  { infinitive: 'escrever', translations: ['to write'] },
  { infinitive: 'olhar', translations: ['to look'] },
  { infinitive: 'receber', translations: ['to receive'] },
  { infinitive: 'telefonar', translations: ['to phone'] },
  { infinitive: 'esperar', translations: ['to wait', 'to hope'] },
  { infinitive: 'mudar', translations: ['to change'] },
  { infinitive: 'pensar', translations: ['to think'] },
  { infinitive: 'perder', translations: ['to lose'] },
  { infinitive: 'regressar', translations: ['to return'] },
  { infinitive: 'alugar', translations: ['to rent'] },
  { infinitive: 'cozer', translations: ['to cook', 'to boil'] },
  { infinitive: 'descer', translations: ['to go down'] },
  { infinitive: 'entrar', translations: ['to enter'] },
  { infinitive: 'vender', translations: ['to sell'] },
  { infinitive: 'ajudar', translations: ['to help'] },
  { infinitive: 'avisar', translations: ['to warn', 'to notify'] },
  { infinitive: 'convidar', translations: ['to invite'] },
  { infinitive: 'discutir', translations: ['to discuss'] },
  { infinitive: 'escolher', translations: ['to choose'] },
  { infinitive: 'estragar', translations: ['to damage', 'to spoil'] },
  { infinitive: 'passear', translations: ['to go for a walk'] },
  { infinitive: 'perceber', translations: ['to understand'] },
  { infinitive: 'planear', translations: ['to plan'] },
  { infinitive: 'preocupar-se', baseInfinitive: 'preocupar', reflexive: true, translations: ['to worry'] },
  { infinitive: 'preparar', translations: ['to prepare'] },
  { infinitive: 'abrir', translations: ['to open'] },
  { infinitive: 'encerrar', translations: ['to close', 'to end'] },
  { infinitive: 'fechar', translations: ['to close'] },
  { infinitive: 'assinar', translations: ['to sign'] },
  { infinitive: 'contornar', translations: ['to go around'] },
  { infinitive: 'depositar', translations: ['to deposit'] },
  { infinitive: 'levantar', translations: ['to lift', 'to withdraw'] },
  { infinitive: 'mandar', translations: ['to send', 'to order'] },
  { infinitive: 'parar', translations: ['to stop'] },
  { infinitive: 'preencher', translations: ['to fill in'] },
  { infinitive: 'trocar', translations: ['to exchange', 'to change'] },
  { infinitive: 'virar', translations: ['to turn'] },
  { infinitive: 'admirar', translations: ['to admire'] },
  { infinitive: 'assistir', translations: ['to watch', 'to attend'] },
  { infinitive: 'colocar', translations: ['to place', 'to put'] },
  { infinitive: 'explorar', translations: ['to explore'] },
  { infinitive: 'juntar', translations: ['to join', 'to gather'] },
  { infinitive: 'misturar', translations: ['to mix'] },
  { infinitive: 'provar', translations: ['to try', 'to taste'] },
  { infinitive: 'tapar', translations: ['to cover'] },
  { infinitive: 'arrumar', translations: ['to tidy'] },
  { infinitive: 'aspirar', translations: ['to vacuum', 'to aspire'] },
  { infinitive: 'brindar', translations: ['to toast'] },
  { infinitive: 'dever', translations: ['should', 'to owe'] },
  { infinitive: 'lavar', translations: ['to wash'] },
  { infinitive: 'passar a ferro', baseInfinitive: 'passar', suffix: 'a ferro', translations: ['to iron'] },
  { infinitive: 'acabar de', baseInfinitive: 'acabar', suffix: 'de', translations: ['to have just'] },
  { infinitive: 'continuar', translations: ['to continue'] },
  { infinitive: 'decorar', translations: ['to decorate', 'to memorize'] },
  { infinitive: 'deixar de', baseInfinitive: 'deixar', suffix: 'de', translations: ['to stop doing'] },
  { infinitive: 'demorar', translations: ['to take time'] },
  { infinitive: 'divorciar-se', baseInfinitive: 'divorciar', reflexive: true, translations: ['to divorce'] },
  { infinitive: 'mudar-se', baseInfinitive: 'mudar', reflexive: true, translations: ['to move house'] },
  { infinitive: 'reformar-se', baseInfinitive: 'reformar', reflexive: true, translations: ['to retire'] },
  { infinitive: 'terminar', translations: ['to finish'] },
  { infinitive: 'andar a', baseInfinitive: 'andar', suffix: 'a', translations: ['to be doing'] },
  { infinitive: 'costumar', translations: ['to usually do'] },
  { infinitive: 'adormecer', translations: ['to fall asleep'] },
  { infinitive: 'andar a cavalo', baseInfinitive: 'andar', suffix: 'a cavalo', translations: ['to ride a horse'] },
  { infinitive: 'chorar', translations: ['to cry'] },
  { infinitive: 'chumbar', translations: ['to fail an exam'] },
  { infinitive: 'namorar', translations: ['to date'] },
  { infinitive: 'partir', translations: ['to leave', 'to depart'] },
  { infinitive: 'roubar', translations: ['to steal'] },
  { infinitive: 'amar', translations: ['to love'] },
  { infinitive: 'depender', translations: ['to depend'] },
  { infinitive: 'devolver', translations: ['to return', 'to give back'] },
  { infinitive: 'embrulhar', translations: ['to wrap'] },
  { infinitive: 'emprestar', translations: ['to lend'] },
  { infinitive: 'encomendar', translations: ['to order'] },
  { infinitive: 'inserir', translations: ['to insert'] },
  { infinitive: 'mostrar', translations: ['to show'] },
  { infinitive: 'oferecer', translations: ['to offer'] },
  { infinitive: 'calçar', translations: ['to put on shoes'] },
  { infinitive: 'descalçar', translations: ['to take off shoes'] },
  { infinitive: 'importar-se', baseInfinitive: 'importar', reflexive: true, translations: ['to mind'] },
  { infinitive: 'parecer', translations: ['to seem'] },
  { infinitive: 'emagrecer', translations: ['to lose weight'] },
  { infinitive: 'engordar', translations: ['to gain weight'] },
  { infinitive: 'evitar', translations: ['to avoid'] },
  { infinitive: 'exagerar', translations: ['to exaggerate'] },
  { infinitive: 'marcar', translations: ['to mark', 'to book'] },
  { infinitive: 'apaixonar-se', baseInfinitive: 'apaixonar', reflexive: true, translations: ['to fall in love'] },
  { infinitive: 'apresentar', translations: ['to present', 'to introduce'] },
  { infinitive: 'contar', translations: ['to count', 'to tell'] },
  { infinitive: 'decidir', translations: ['to decide'] },
  { infinitive: 'encontrar', translations: ['to find', 'to meet'] },
  { infinitive: 'alterar', translations: ['to alter'] },
  { infinitive: 'cancelar', translations: ['to cancel'] },
  { infinitive: 'gritar', translations: ['to shout'] },
  { infinitive: 'mergulhar', translations: ['to dive'] },
  { infinitive: 'responder', translations: ['to answer'] },
];

function getRegularVerbEnding(infinitive: string): RegularVerbEnding {
  const ending = infinitive.slice(-2);

  if (ending === 'ar' || ending === 'er' || ending === 'ir') {
    return ending;
  }

  throw new Error(`Unsupported regular verb ending for ${infinitive}`);
}

function getPpsStem(infinitive: string): string {
  const stem = infinitive.slice(0, -2);

  if (infinitive.endsWith('çar')) {
    return `${stem.slice(0, -1)}c`;
  }

  if (infinitive.endsWith('car')) {
    return `${stem.slice(0, -1)}qu`;
  }

  if (infinitive.endsWith('gar')) {
    return `${stem.slice(0, -1)}gu`;
  }

  return stem;
}

function createRegularFormValues(infinitive: string, time: keyof (typeof regularEndings)[RegularVerbEnding]): string[] {
  const ending = getRegularVerbEnding(infinitive);

  if (time === 'presente' && infinitive.endsWith('ear')) {
    const stem = infinitive.slice(0, -3);
    return ['eio', 'eias', 'eia', 'eamos', 'eiam'].map((suffix) => `${stem}${suffix}`);
  }

  if (time === 'presente' && infinitive.endsWith('cer')) {
    const stem = infinitive.slice(0, -2);
    const presente = regularEndings[ending][time].map((suffix) => `${stem}${suffix}`);
    return [`${stem.slice(0, -1)}ço`, ...presente.slice(1)];
  }

  const stem = time === 'pps' ? getPpsStem(infinitive) : infinitive.slice(0, -2);

  return regularEndings[ending][time].map((suffix, index) => {
    if (time === 'pps' && index > 0) {
      return `${infinitive.slice(0, -2)}${suffix}`;
    }

    return `${stem}${suffix}`;
  });
}

function applyVerbInputForm(value: string, input: RegularVerbInput, index: number): string {
  const suffix = Array.isArray(input.suffix) ? input.suffix[index] : input.suffix;

  if (!input.reflexive) {
    return suffix ? `${value} ${suffix}` : value;
  }

  const reflexiveValue =
    index === 3 ? `${value.slice(0, -1)}${reflexivePronouns[index]}` : `${value}${reflexivePronouns[index]}`;

  return suffix ? `${reflexiveValue} ${suffix}` : reflexiveValue;
}

function createRegularForms(
  input: RegularVerbInput,
  time: keyof (typeof regularEndings)[RegularVerbEnding]
): VerbForm[] {
  const baseInfinitive = input.baseInfinitive ?? input.infinitive;

  return createVerbForms(
    createRegularFormValues(baseInfinitive, time).map((value, index) => applyVerbInputForm(value, input, index))
  );
}

function createRegularVerb(input: RegularVerbInput): Verb {
  return {
    infinitive: input.infinitive,
    translations: input.translations,
    times: {
      presente: createRegularForms(input, 'presente'),
      pps: createRegularForms(input, 'pps'),
    },
  };
}

export const a2RegularVerbs: Verb[] = regularVerbInputs.map(createRegularVerb);
