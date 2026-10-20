import PropTypes from "prop-types";

const colors = {
  info: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
  success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  warning: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  danger: "border-rose-400/20 bg-rose-400/10 text-rose-300",
};

export default function Badge({ children, color = "info", className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${colors[color]} ${className}`}
    >
      {children}
    </span>
  );
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf(["info", "success", "warning", "danger"]),
  className: PropTypes.string,
};
