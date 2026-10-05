function Badge({label, variant = "info"}) {
    const styles = {
      info: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
      success:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
      warning:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
      danger:
        "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
    };

    return (
      <div
        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[variant]}`}
      >
        <span> {label} </span>
      </div>
    );
}

export default Badge;