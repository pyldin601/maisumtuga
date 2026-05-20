import type { VerbQuizQuestion } from '../../../data/verbTypes.ts';
import type { VerbQuizSessionAnswer, VerbQuizSessionItem } from './useVerbQuizSession';

function createAnswerId(): string {
  return crypto.randomUUID();
}

export function createAnswer(questionIndex: number): VerbQuizSessionAnswer {
  return {
    answerStatus: 'pending',
    answerId: createAnswerId(),
    questionIndex,
    typedAnswer: '',
  };
}

export function createInitialAnswers(questions: readonly VerbQuizQuestion[]): readonly VerbQuizSessionAnswer[] {
  return questions.length > 0 ? [createAnswer(0)] : [];
}

export function getIsSessionClosed(
  questions: readonly VerbQuizQuestion[],
  answers: readonly VerbQuizSessionAnswer[]
): boolean {
  const lastAnswer = answers.at(-1);
  const hasNoQuestions = questions.length === 0;
  const isLastQuestionAnswered =
    lastAnswer?.questionIndex === questions.length - 1 && lastAnswer.answerStatus !== 'pending';

  return hasNoQuestions || isLastQuestionAnswered;
}

export function getSessionItems(
  questions: readonly VerbQuizQuestion[],
  answers: readonly VerbQuizSessionAnswer[]
): readonly VerbQuizSessionItem[] {
  return answers.map((answer): VerbQuizSessionItem => {
    const question = questions.at(answer.questionIndex);

    if (!question) {
      throw new Error(`Missing question for answer index ${answer.questionIndex}`);
    }

    return { question, answer };
  });
}
