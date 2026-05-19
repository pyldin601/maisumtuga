import { useState } from 'react';

import type { VerbTime } from '../../../data/a2IrregularVerbs';
import { createAnswer, createInitialAnswers, getIsSessionClosed, getSessionItems } from './useVerbQuizSession.helpers';

export type VerbQuizSessionQuestion = {
  readonly correctAnswer: string;
  readonly infinitiveForm: string;
  readonly subjectFull: string;
  readonly subjectShort: string;
  readonly time: VerbTime;
  readonly translations: readonly string[];
};

export type VerbQuizSessionAnswer = {
  readonly answerId: string;
  readonly questionIndex: number;
  readonly typedAnswer: string;
  readonly answerStatus: 'correct' | 'wrong' | 'pending';
};

export type VerbQuizSessionItem = {
  readonly question: VerbQuizSessionQuestion;
  readonly answer: VerbQuizSessionAnswer;
};

interface VerbQuizSessionStore {
  isClosed: boolean;
  items: readonly VerbQuizSessionItem[];
  continueSession(newQuestions: readonly VerbQuizSessionQuestion[]): void;
  resolveCorrectQuestion(answerId: string, typedAnswer: string): void;
  resolveWrongQuestion(answerId: string, typedAnswer: string): void;
  showNextQuestion(): void;
}

export function useVerbQuizSession(initialQuestions: readonly VerbQuizSessionQuestion[]): VerbQuizSessionStore {
  const [questions, setQuestions] = useState(initialQuestions);
  const [answers, setAnswers] = useState(() => createInitialAnswers(questions));

  const items = getSessionItems(questions, answers);
  const isClosed = getIsSessionClosed(questions, answers);

  function resolveQuestion(
    answerId: string,
    typedAnswer: string,
    answerStatus: VerbQuizSessionAnswer['answerStatus']
  ): void {
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
  }

  function showNextQuestion(): void {
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
  }

  return {
    isClosed,
    items,
    continueSession(newQuestions: readonly VerbQuizSessionQuestion[]): void {
      setQuestions(newQuestions);
      setAnswers(createInitialAnswers(newQuestions));
    },
    resolveCorrectQuestion(answerId: string, typedAnswer: string): void {
      resolveQuestion(answerId, typedAnswer, 'correct');
    },
    resolveWrongQuestion(answerId: string, typedAnswer: string): void {
      resolveQuestion(answerId, typedAnswer, 'wrong');
    },
    showNextQuestion,
  };
}
