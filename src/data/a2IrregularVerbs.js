export const a2VerbSubjects = [
  { full: 'eu', short: 'eu' },
  { full: 'tu', short: 'tu' },
  { full: 'você/ele/ela', short: 'voce' },
  { full: 'nós', short: 'nos' },
  { full: 'vocês/eles/elas', short: 'voces' },
];

function forms(values) {
  return a2VerbSubjects.map((subject, index) => ({
    form: values[index],
    subjectFull: subject.full,
    subjectShort: subject.short,
  }));
}

export const a2Verbs = [
  {
    infinitive: 'ser',
    translations: ['to be'],
    times: {
      presente: forms(['sou', 'és', 'é', 'somos', 'são']),
      pps: forms(['fui', 'foste', 'foi', 'fomos', 'foram']),
    },
  },
  {
    infinitive: 'estar',
    translations: ['to be'],
    times: {
      presente: forms(['estou', 'estás', 'está', 'estamos', 'estão']),
      pps: forms(['estive', 'estiveste', 'esteve', 'estivemos', 'estiveram']),
    },
  },
  {
    infinitive: 'ter',
    translations: ['to have'],
    times: {
      presente: forms(['tenho', 'tens', 'tem', 'temos', 'têm']),
      pps: forms(['tive', 'tiveste', 'teve', 'tivemos', 'tiveram']),
    },
  },
  {
    infinitive: 'ir',
    translations: ['to go'],
    times: {
      presente: forms(['vou', 'vais', 'vai', 'vamos', 'vão']),
      pps: forms(['fui', 'foste', 'foi', 'fomos', 'foram']),
    },
  },
  {
    infinitive: 'fazer',
    translations: ['to do', 'to make'],
    times: {
      presente: forms(['faço', 'fazes', 'faz', 'fazemos', 'fazem']),
      pps: forms(['fiz', 'fizeste', 'fez', 'fizemos', 'fizeram']),
    },
  },
  {
    infinitive: 'dizer',
    translations: ['to say', 'to tell'],
    times: {
      presente: forms(['digo', 'dizes', 'diz', 'dizemos', 'dizem']),
      pps: forms(['disse', 'disseste', 'disse', 'dissemos', 'disseram']),
    },
  },
  {
    infinitive: 'poder',
    translations: ['can', 'to be able to'],
    times: {
      presente: forms(['posso', 'podes', 'pode', 'podemos', 'podem']),
      pps: forms(['pude', 'pudeste', 'pôde', 'pudemos', 'puderam']),
    },
  },
  {
    infinitive: 'querer',
    translations: ['to want'],
    times: {
      presente: forms(['quero', 'queres', 'quer', 'queremos', 'querem']),
      pps: forms(['quis', 'quiseste', 'quis', 'quisemos', 'quiseram']),
    },
  },
  {
    infinitive: 'saber',
    translations: ['to know'],
    times: {
      presente: forms(['sei', 'sabes', 'sabe', 'sabemos', 'sabem']),
      pps: forms(['soube', 'soubeste', 'soube', 'soubemos', 'souberam']),
    },
  },
  {
    infinitive: 'ver',
    translations: ['to see'],
    times: {
      presente: forms(['vejo', 'vês', 'vê', 'vemos', 'veem']),
      pps: forms(['vi', 'viste', 'viu', 'vimos', 'viram']),
    },
  },
  {
    infinitive: 'vir',
    translations: ['to come'],
    times: {
      presente: forms(['venho', 'vens', 'vem', 'vimos', 'vêm']),
      pps: forms(['vim', 'vieste', 'veio', 'viemos', 'vieram']),
    },
  },
  {
    infinitive: 'dar',
    translations: ['to give'],
    times: {
      presente: forms(['dou', 'dás', 'dá', 'damos', 'dão']),
      pps: forms(['dei', 'deste', 'deu', 'demos', 'deram']),
    },
  },
  {
    infinitive: 'pôr',
    translations: ['to put'],
    times: {
      presente: forms(['ponho', 'pões', 'põe', 'pomos', 'põem']),
      pps: forms(['pus', 'puseste', 'pôs', 'pusemos', 'puseram']),
    },
  },
  {
    infinitive: 'cair',
    translations: ['to fall'],
    times: {
      presente: forms(['caio', 'cais', 'cai', 'caímos', 'caem']),
      pps: forms(['caí', 'caíste', 'caiu', 'caímos', 'caíram']),
    },
  },
  {
    infinitive: 'trazer',
    translations: ['to bring'],
    times: {
      presente: forms(['trago', 'trazes', 'traz', 'trazemos', 'trazem']),
      pps: forms(['trouxe', 'trouxeste', 'trouxe', 'trouxemos', 'trouxeram']),
    },
  },
  {
    infinitive: 'haver',
    translations: ['there to be', 'to exist'],
    notes: 'Mostly used impersonally at A2: há / houve.',
    times: {
      presente: forms(['hei', 'hás', 'há', 'havemos', 'hão']),
      pps: forms(['houve', 'houveste', 'houve', 'houvemos', 'houveram']),
    },
  },
  {
    infinitive: 'ler',
    translations: ['to read'],
    times: {
      presente: forms(['leio', 'lês', 'lê', 'lemos', 'leem']),
      pps: forms(['li', 'leste', 'leu', 'lemos', 'leram']),
    },
  },
  {
    infinitive: 'ouvir',
    translations: ['to hear', 'to listen'],
    times: {
      presente: forms(['ouço', 'ouves', 'ouve', 'ouvimos', 'ouvem']),
      pps: forms(['ouvi', 'ouviste', 'ouviu', 'ouvimos', 'ouviram']),
    },
  },
  {
    infinitive: 'pedir',
    translations: ['to ask for', 'to order'],
    times: {
      presente: forms(['peço', 'pedes', 'pede', 'pedimos', 'pedem']),
      pps: forms(['pedi', 'pediste', 'pediu', 'pedimos', 'pediram']),
    },
  },
];
