import type { VerbTime, VerbTimeShortName } from './verbTypes.ts';

export const a2VerbTimes: Record<VerbTimeShortName, VerbTime> = {
  presente: {
    fullName: 'presente',
    shortName: 'presente',
  },
  pps: {
    fullName: 'p.p.s.',
    shortName: 'pps',
  },
  imperfeito: {
    fullName: 'p. imperfeito',
    shortName: 'imperfeito',
  },
  imperativoAfirmativo: {
    fullName: 'imperativo afirmativo',
    shortName: 'imperativoAfirmativo',
  },
  imperativoNegativo: {
    fullName: 'imperativo negativo',
    shortName: 'imperativoNegativo',
  },
};
