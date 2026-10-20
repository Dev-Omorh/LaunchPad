import PropTypes from "prop-types";
import Badge from "../ui/Badge";

function passed(test) {
  return Boolean(test.passed ?? test.success);
}

export default function OutputPanel({
  stdout = "",
  stderr = "",
  tests = [],
  className = "",
}) {
  const hasOutput = Boolean(stdout || stderr || tests.length);

  return (
    <section
      aria-label="Execution output"
      className={`overflow-hidden rounded-xl border border-slate-700 bg-slate-950 ${className}`}
    >
      <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">
          Console output
        </h2>
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-rose-400" />
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
        </span>
      </header>
      <div className="space-y-4 p-4">
        {!hasOutput && (
          <p className="font-mono text-xs text-slate-500">
            Run your solution to see output here.
          </p>
        )}
        {stdout && (
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              stdout
            </p>
            <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-5 text-slate-200">
              {stdout}
            </pre>
          </div>
        )}
        {stderr && (
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-rose-300">
              stderr
            </p>
            <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-5 text-rose-200">
              {stderr}
            </pre>
          </div>
        )}
        {tests.length > 0 && (
          <div className="space-y-2 border-t border-slate-800 pt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Unit tests
            </p>
            {tests.map((test, index) => {
              const isPassed = passed(test);
              return (
                <div
                  key={test.id ?? test.name ?? index}
                  className="flex items-start justify-between gap-3 text-xs"
                >
                  <span className="font-mono text-slate-300">
                    {test.name ?? `Test ${index + 1}`}
                    {test.message && (
                      <span className="ml-2 text-slate-500">{test.message}</span>
                    )}
                  </span>
                  <Badge color={isPassed ? "success" : "danger"}>
                    {isPassed ? "PASS" : "FAIL"}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

OutputPanel.propTypes = {
  stdout: PropTypes.string,
  stderr: PropTypes.string,
  tests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      passed: PropTypes.bool,
      success: PropTypes.bool,
      message: PropTypes.string,
    }),
  ),
  className: PropTypes.string,
};
