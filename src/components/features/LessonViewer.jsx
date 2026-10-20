import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  getQuestions,
  submitAnswerStep,
  submitCode,
} from "../../services/api";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import FeedbackPanel from "../ui/FeedbackPanel";
import OutputPanel from "./OutputPanel";

function normalizeQuestions(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.questions)) return response.questions;
  if (response?.question) return [response.question];
  return [];
}

export default function LessonViewer({
  userId,
  filters = {},
  onQuestionComplete,
  onQuizComplete,
}) {
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [execution, setExecution] = useState(null);
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadQuestion() {
      setLoadingQuestion(true);
      setError("");
      setFeedback(null);
      setExecution(null);
      setAnswer("");
      try {
        const response = await getQuestions({
          subject: filters.subject ?? "",
          concept: filters.concept ?? "",
          difficulty: filters.difficulty ?? "",
          mode: filters.mode ?? "",
        });
        if (!active) return;

        const questions = normalizeQuestions(response);
        if (!questions.length) {
          setQuestion(null);
          setError("No questions are available for these filters.");
          return;
        }
        setQuestion(questions[0]);
        setCode(questions[0].starter_code ?? questions[0].starterCode ?? "");
      } catch (requestError) {
        if (active) {
          setError(requestError.message || "Could not load a practice question.");
        }
      } finally {
        if (active) setLoadingQuestion(false);
      }
    }

    loadQuestion();
    return () => {
      active = false;
    };
  }, [filters.subject, filters.concept, filters.difficulty, filters.mode, reloadKey]);

  const submit = async (event) => {
    event.preventDefault();
    if (!question) return;
    setSubmitting(true);
    setError("");
    setFeedback(null);
    setExecution(null);

    const questionId = question.id ?? question.question_id;
    const payload = {
      user_id: userId,
      question_id: questionId,
      answer: answer || code,
      code,
    };

    try {
      const response =
        question.type === "multiple_choice" ||
        question.type === "short_answer" ||
        question.options
          ? await submitAnswerStep(payload)
          : await submitCode(payload);

      setFeedback(response);
      setExecution({
        stdout: response.stdout ?? response.output ?? "",
        stderr: response.stderr ?? response.error ?? "",
        tests: response.tests ?? response.test_results ?? [],
      });
      onQuestionComplete(response, question);

      if (response.quiz_complete || response.session_complete || response.is_complete) {
        onQuizComplete(response);
      }
    } catch (requestError) {
      setError(requestError.message || "Your answer could not be submitted.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingQuestion) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">
        Loading your next challenge…
      </div>
    );
  }

  if (!question) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <FeedbackPanel status="warning" title="Challenge unavailable" message={error} />
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => setReloadKey((key) => key + 1)}
        >
          Try again
        </Button>
      </div>
    );
  }

  const questionTitle = question.title ?? question.name ?? "Practice challenge";
  const options = Array.isArray(question.options) ? question.options : [];

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/20">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-5 py-4 sm:px-7">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-cyan-400">DECODEPY / LAB</span>
          {question.difficulty && (
            <Badge color={question.difficulty === "hard" ? "danger" : question.difficulty === "easy" ? "success" : "warning"}>
              {question.difficulty}
            </Badge>
          )}
        </div>
        {question.concept && (
          <span className="text-xs text-slate-500">{question.concept}</span>
        )}
      </header>

      <form onSubmit={submit} className="space-y-6 p-5 sm:p-7">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            {questionTitle}
          </h1>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">
            {question.prompt ?? question.description ?? question.question}
          </p>
        </div>

        {options.length > 0 ? (
          <fieldset className="space-y-2">
            <legend className="mb-2 text-sm font-medium text-slate-300">
              Choose an answer
            </legend>
            {options.map((option, index) => {
              const value =
                typeof option === "string" ? option : option.value ?? option.id;
              const label =
                typeof option === "string" ? option : option.label ?? option.text;
              return (
                <label
                  key={value ?? index}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors ${answer === value ? "border-cyan-400 bg-cyan-400/10 text-white" : "border-slate-700 bg-slate-950/50 text-slate-300 hover:border-slate-500"}`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={value}
                    checked={answer === value}
                    onChange={(event) => setAnswer(event.target.value)}
                    className="accent-cyan-400"
                  />
                  {label}
                </label>
              );
            })}
          </fieldset>
        ) : (
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">
              Your Python solution
            </span>
            <textarea
              value={code}
              onChange={(event) => setCode(event.target.value)}
              spellCheck="false"
              rows={12}
              aria-label="Python code editor"
              className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-sm leading-6 text-emerald-200 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              placeholder="# Write your solution here"
            />
          </label>
        )}

        {error && <FeedbackPanel status="error" title="Request failed" message={error} />}
        {feedback && (
          <FeedbackPanel
            status={
              feedback.passed || feedback.success || feedback.correct
                ? "success"
                : feedback.passed === false ||
                    feedback.success === false ||
                    feedback.correct === false
                  ? "error"
                  : "info"
            }
            title={feedback.title ?? "Grading feedback"}
            message={feedback.feedback ?? feedback.message ?? feedback}
          />
        )}
        {execution && (
          <OutputPanel
            stdout={execution.stdout}
            stderr={execution.stderr}
            tests={execution.tests}
          />
        )}

        <div className="flex flex-wrap justify-between gap-3 border-t border-slate-800 pt-5">
          <Button
            type="button"
            variant="outline"
            onClick={() => setReloadKey((key) => key + 1)}
          >
            Skip question
          </Button>
          <Button
            type="submit"
            isLoading={submitting}
            disabled={options.length > 0 ? !answer : !code.trim()}
          >
            {submitting ? "Checking…" : "Run tests & submit"}
          </Button>
        </div>
      </form>
    </section>
  );
}

LessonViewer.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  filters: PropTypes.shape({
    subject: PropTypes.string,
    concept: PropTypes.string,
    difficulty: PropTypes.string,
    mode: PropTypes.string,
  }),
  onQuestionComplete: PropTypes.func,
  onQuizComplete: PropTypes.func,
};
