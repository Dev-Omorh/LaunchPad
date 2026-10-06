import {useState, useEffect} from "react";
import Badge from "../UI/Badge"
import Button from "../UI/Button";
import FeedbackPanel from "../UI/FeedbackPanel";

function LessonViewer({subject, concept}) {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [userCode, setUserCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        async function fetchQuestion() {
            const res = await fetch();
            const data = await res.json();
            setCurrentQuestion(data);
            setUserCode(data.starter_code || "")
        }
        fetchQuestion();
    }, [subject, concept]);

    const handleSubmitCode = async () => {
        setLoading(true);
        const res = await fetch("/submit-code", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({code: userCode, question_id: currentQuestion.id }),
        });
        const result =  await res.json();
        setFeedback(result);
        setLoading(false);
    } 

    if (!currentQuestion) return <div>Loading question from Question Bank...</div>
    return (
      <div className="bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{currentQuestion.title}</h2>
          <Badge label={currentQuestion.difficulty} variant="info" />
        </div>

        <p className="text-slate-300">{currentQuestion.prompt}</p>

        <textarea
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          className="w-full h-40 bg-slate-950 font-mono text-sm p-3 rounded-lg border border-slate-800 text-emerald-400 focus:outline-none"
        />

        {feedback && (
          <FeedbackPanel
            status={FeedbackPanel.status}
            feedback={feedback.message}
          />
        )}

        <div className="flex justify-end">
          <Button
            varient="primary"
            isLoading={loading}
            onClick={handleSubmitCode}
          >
            Submit Code
          </Button>
        </div>
      </div>
    );
}

export default LessonViewer;