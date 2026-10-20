import PropTypes from "prop-types";
import Badge from "./Badge";

const statusStyles = {
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100",
  error: "border-rose-500/30 bg-rose-500/10 text-rose-100",
  info: "border-cyan-500/30 bg-cyan-500/10 text-cyan-100",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-100",
};

export default function FeedbackPanel({
  status = "info",
  title,
  message,
  feedback,
  className = "",
}) {
  const content = message ?? feedback;
  const description =
    typeof content === "string"
      ? content
      : content?.message ?? content?.feedback ?? content?.detail;
  const resolvedStatus =
    status === "success" || status === "error" || status === "warning"
      ? status
      : "info";
  const badgeColor =
    resolvedStatus === "error" ? "danger" : resolvedStatus;

  if (!description && !title) return null;

  return (
    <section
      role="status"
      aria-live="polite"
      className={`rounded-xl border p-4 ${statusStyles[resolvedStatus]} ${className}`}
    >
      <div className="flex items-start gap-3">
        <Badge color={badgeColor}>
          {resolvedStatus === "success"
            ? "Passed"
            : resolvedStatus === "error"
              ? "Needs work"
              : resolvedStatus === "warning"
                ? "Check"
                : "Feedback"}
        </Badge>
        <div className="min-w-0 flex-1">
          {title && <h3 className="font-semibold">{title}</h3>}
          {description && (
            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 opacity-90">
              {description}
            </p>
          )}
          {content && typeof content === "object" && content.output && (
            <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950/70 p-3 font-mono text-xs text-slate-200">
              {content.output}
            </pre>
          )}
        </div>
      </div>
    </section>
  );
}

FeedbackPanel.propTypes = {
  status: PropTypes.oneOf(["success", "error", "info", "warning"]),
  title: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  feedback: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.string,
};
