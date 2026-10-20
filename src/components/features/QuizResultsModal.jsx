import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { finalizeResults, getLeaderboard } from "../../services/api";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import FeedbackPanel from "../ui/FeedbackPanel";

function entriesOf(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.entries)) return value.entries;
  if (Array.isArray(value?.leaderboard)) return value.leaderboard;
  return [];
}

export default function QuizResultsModal({
  isOpen,
  userId,
  subject = "",
  results = {},
  onClose,
}) {
  const [finalResult, setFinalResult] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return undefined;

    let active = true;

    async function loadResults() {
      setLoading(true);
      setError("");
      const [finalizeOutcome, leaderboardOutcome] = await Promise.allSettled([
        finalizeResults({ ...results, user_id: userId, subject }),
        getLeaderboard(subject),
      ]);
      if (!active) return;

      const errors = [];
      if (finalizeOutcome.status === "fulfilled") {
        setFinalResult(finalizeOutcome.value);
      } else {
        errors.push(
          `Final score: ${finalizeOutcome.reason.message || "request failed"}`,
        );
      }

      if (leaderboardOutcome.status === "fulfilled") {
        setLeaderboard(entriesOf(leaderboardOutcome.value));
      } else {
        errors.push(
          `Leaderboard: ${leaderboardOutcome.reason.message || "request failed"}`,
        );
      }

      setError(errors.join(" "));
      setLoading(false);
    }

    loadResults();
    return () => {
      active = false;
    };
  }, [isOpen, userId, subject, results]);

  if (!isOpen) return null;

  const score = finalResult?.decode_score ?? finalResult?.score;
  const breakdown = finalResult?.breakdown ?? finalResult?.score_breakdown ?? {};
  const scoreItems = Object.entries(breakdown).filter(
    ([, value]) => typeof value !== "object",
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-sm"
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-results-title"
        className="my-auto w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
      >
        <header className="flex items-start justify-between border-b border-slate-800 p-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-cyan-400">
              Session complete
            </p>
            <h2 id="quiz-results-title" className="mt-2 text-2xl font-bold text-white">
              Your Decode Score
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close results"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </header>

        <div className="max-h-[70vh] space-y-6 overflow-y-auto p-6">
          {loading && (
            <p className="text-sm text-slate-400">Calculating your final score…</p>
          )}
          {error && (
            <FeedbackPanel status="error" title="Results unavailable" message={error} />
          )}
          {score !== undefined && score !== null && (
            <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-5 text-center">
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Decode Score
              </p>
              <p className="mt-2 font-mono text-5xl font-bold text-cyan-300">
                {score}
              </p>
            </div>
          )}

          {scoreItems.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-white">Score breakdown</h3>
              <dl className="grid gap-2 sm:grid-cols-2">
                {scoreItems.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between gap-3 rounded-lg bg-slate-800/70 px-3 py-2 text-sm"
                  >
                    <dt className="capitalize text-slate-400">
                      {label.replaceAll("_", " ")}
                    </dt>
                    <dd className="font-mono text-slate-100">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Global leaderboard</h3>
              {subject && <Badge color="info">{subject}</Badge>}
            </div>
            {leaderboard.length ? (
              <ol className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <li
                    key={entry.user_id ?? entry.id ?? index}
                    className="flex items-center justify-between rounded-lg bg-slate-800/70 px-4 py-3 text-sm"
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-slate-500">
                        #{entry.rank ?? index + 1}
                      </span>
                      <span className="text-slate-200">
                        {entry.username ?? entry.name ?? "Learner"}
                      </span>
                    </span>
                    <span className="font-mono font-semibold text-cyan-300">
                      {entry.decode_score ?? entry.score ?? "—"}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              !loading &&
              !error && (
                <p className="text-sm text-slate-500">No leaderboard entries yet.</p>
              )
            )}
          </div>
        </div>

        <footer className="flex justify-end border-t border-slate-800 p-5">
          <Button onClick={onClose}>Back to practice</Button>
        </footer>
      </section>
    </div>
  );
}

QuizResultsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  subject: PropTypes.string,
  results: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
