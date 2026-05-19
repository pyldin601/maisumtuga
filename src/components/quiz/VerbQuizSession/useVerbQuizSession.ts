import { useState } from 'react';

import { createAnswer, createInitialAnswers, getIsSessionClosed, getSessionItems } from './useVerbQuizSession.helpers';

export type VerbQuizSessionQuestion = {
  readonly correctAnswer: string;
  readonly infinitiveForm: string;
  readonly subjectFull: string;
  readonly subjectShort: string;
  readonly time: string;
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

      const nextQuestionIndex = answer.questionIndex + 1;
      const hasNextQuestion = nextQuestionIndex < questions.length;

      const nextAnswers = currentAnswers.map((currentAnswer, currentAnswerIndex) => {
        if (currentAnswerIndex === answerIndex) {
          return { ...currentAnswer, answerStatus, typedAnswer };
        }

        return currentAnswer;
      });

      return hasNextQuestion ? nextAnswers.concat(createAnswer(nextQuestionIndex)) : nextAnswers;
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
  };
}
