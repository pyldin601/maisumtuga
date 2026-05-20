import { useCallback, useState } from 'react';

import type { VerbQuizQuestion } from '../../../data/verbTypes.ts';
import { createAnswer, createInitialAnswers, getIsSessionClosed, getSessionItems } from './useVerbQuizSession.helpers';

export type VerbQuizSessionAnswer = {
  readonly answerId: string;
  readonly questionIndex: number;
  readonly typedAnswer: string;
  readonly answerStatus: 'correct' | 'wrong' | 'pending';
};

export type VerbQuizSessionItem = {
  readonly question: VerbQuizQuestion;
  readonly answer: VerbQuizSessionAnswer;
};

interface VerbQuizSessionStore {
  isClosed: boolean;
  items: readonly VerbQuizSessionItem[];
  continueSession(newQuestions: readonly VerbQuizQuestion[]): void;
  resolveCorrectQuestion(answerId: string, typedAnswer: string): void;
  resolveWrongQuestion(answerId: string, typedAnswer: string): void;
  showNextQuestion(): void;
}

export function useVerbQuizSession(initialQuestions: readonly VerbQuizQuestion[]): VerbQuizSessionStore {
  const [questions, setQuestions] = useState(initialQuestions);
  const [answers, setAnswers] = useState(() => createInitialAnswers(questions));

  const items = getSessionItems(questions, answers);
  const isClosed = getIsSessionClosed(questions, answers);

  const resolveQuestion = useCallback(
    (answerId: string, typedAnswer: string, answerStatus: VerbQuizSessionAnswer['answerStatus']): void => {
      setAnswers((currentAnswers) => {
        const answerIndex = currentAnswers.findIndex((answer) => answer.answerId === answerId);

        if (answerIndex === -1) {
          return currentAnswers;
        }

        const answer = currentAnswers.at(answerIndex);

        if (!answer || answer.answerStatus !== 'pending') {
          return currentAnswers;
        }

        return currentAnswers.map((currentAnswer, currentAnswerIndex) => {
          if (currentAnswerIndex === answerIndex) {
            return { ...currentAnswer, answerStatus, typedAnswer };
          }

          return currentAnswer;
        });
      });
    },
    []
  );

  const showNextQuestion = useCallback((): void => {
    setAnswers((currentAnswers) => {
      const lastAnswer = currentAnswers.at(-1);

      if (!lastAnswer || lastAnswer.answerStatus === 'pending') {
        return currentAnswers;
      }

      const nextQuestionIndex = lastAnswer.questionIndex + 1;

      if (nextQuestionIndex >= questions.length) {
        return currentAnswers;
      }

      return currentAnswers.concat(createAnswer(nextQuestionIndex));
    });
  }, [questions.length]);

  const continueSession = useCallback((newQuestions: readonly VerbQuizQuestion[]): void => {
    setQuestions(newQuestions);
    setAnswers(createInitialAnswers(newQuestions));
  }, []);

  const resolveCorrectQuestion = useCallback(
    (answerId: string, typedAnswer: string): void => {
      resolveQuestion(answerId, typedAnswer, 'correct');
    },
    [resolveQuestion]
  );

  const resolveWrongQuestion = useCallback(
    (answerId: string, typedAnswer: string): void => {
      resolveQuestion(answerId, typedAnswer, 'wrong');
    },
    [resolveQuestion]
  );

  return {
    isClosed,
    items,
    continueSession,
    resolveCorrectQuestion,
    resolveWrongQuestion,
    showNextQuestion,
  };
}
