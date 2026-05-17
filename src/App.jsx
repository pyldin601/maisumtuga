import { useState } from "react";

const correctAnswer = "caem";

export default function App() {
  const [answer, setAnswer] = useState("");
  const isCorrect = answer.trim().toLocaleLowerCase("pt-PT") === correctAnswer;

  return (
    <main className="page">
      <form
        className="quiz"
        aria-label="Portuguese verb quiz"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="quiz__prompt">
          <p>
            vocês/eles/elas <span className="muted">+</span> cair
            <span className="muted"> / </span>presente
          </p>
        </div>

        <div className="quiz__answer-row">
          <label className="quiz__answer">
            <span className="sr-only">Resposta</span>
            <input
              autoComplete="off"
              autoFocus
              inputMode="text"
              placeholder="escreve só forma verbal"
              spellCheck="false"
              type="text"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
            />
          </label>

          <div className="quiz__result" aria-live="polite">
            {isCorrect && <span className="check" aria-label="Correto">✓</span>}
          </div>
        </div>
      </form>
    </main>
  );
}
