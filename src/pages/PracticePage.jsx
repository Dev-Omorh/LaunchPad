import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import LessonViewer from "../components/features/LessonViewer";
import QuizResultsModal from "../components/features/QuizResultsModal";
import Button from "../components/ui/Button";

export default function PracticePage({
  userId,
  subject = "",
  concept = "",
  difficulty = "",
  mode = "",
}) {
  const [answeredCount, setAnsweredCount] = useState(0);
  const [results, setResults] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleQuestionComplete = useCallback((response, question) => {
    setAnsweredCount((count) => count + 1);
    setResults((current) => ({
      ...current,
      last_question_id: question.id ?? question.question_id,
      last_response: response,
      questions_answered: (current.questions_answered ?? 0) + 1,
    }));
  }, []);

  const handleQuizComplete = useCallback((response) => {
    setResults((current) => ({ ...current, ...response }));
    setShowResults(true);
  }, []);

  const finishSession = () => {
    setResults((current) => ({
      ...current,
      questions_answered: current.questions_answered ?? answeredCount,
    }));
    setShowResults(true);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              LaunchPad Py · DecodePy
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
              Python practice
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Solve a challenge, run the tests, and build your momentum.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              {answeredCount} {answeredCount === 1 ? "challenge" : "challenges"} completed
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={finishSession}
              disabled={answeredCount === 0}
            >
              Finish session
            </Button>
          </div>
        </header>

        <LessonViewer
          userId={userId}
          filters={{ subject, concept, difficulty, mode }}
          onQuestionComplete={handleQuestionComplete}
          onQuizComplete={handleQuizComplete}
        />
      </div>

      <QuizResultsModal
        isOpen={showResults}
        userId={userId}
        subject={subject}
        results={results}
        onClose={() => setShowResults(false)}
      />
    </main>
  );
}

PracticePage.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  subject: PropTypes.string,
  concept: PropTypes.string,
  difficulty: PropTypes.string,
  mode: PropTypes.string,
};
