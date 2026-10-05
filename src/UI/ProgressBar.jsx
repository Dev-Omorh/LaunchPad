function ProgressBar({status, feedback,}) {
    if (!feedback) return null;

    const isSuccess = status === "pass" || status === "correct"; 

    return (
      <div
        className={`p-4 rounded-lg border text-sm font-sans ${
          isSuccess
            ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-200"
            : "bg-rose-950/30 border-rose-500/50 text-rose-200"
        }`}
      >
        <div className="flex items-center gap-2 font-semibold mb-1">
          <span>{isSuccess ? " ✅Step Passed" : " ❎Needs Review"}</span>
        </div>
        <p className="font-mono text-xs opacity-90">{feedback}</p>
      </div>
    );
}

export default ProgressBar;