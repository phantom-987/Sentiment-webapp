import { useState, useMemo } from "react";
import axios from "axios";
import ResultCard from "./ResultCard";
import MoodAnimation from "./MoodAnimation";

function Analyzer({ onResult }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getMood = (data) => {
    if (!data) return "neutral";

    const label = data.label?.toUpperCase();
    const text = data.text?.toLowerCase() || "";

    const excitedWords = ["amazing","incredible","fantastic","love","thrilled","awesome"];
    const sadWords = ["miss","lonely","sad","depressed","hurt","cry"];
    const angryWords = ["hate","worst","awful","furious","angry"];

    if (label === "POSITIVE") {
      return excitedWords.some(w => text.includes(w)) ? "excited" : "happy";
    }

    if (label === "NEGATIVE") {
      return angryWords.some(w => text.includes(w)) ? "angry" : "sad";
    }

    return "neutral";
  };

  const mood = useMemo(() => getMood(result), [result]);

  const analyze = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("http://localhost:8000/analyze", { text });

      const entry = {
        text,
        ...res.data,
        time: new Date().toLocaleTimeString(),
      };

      setResult(entry);
      onResult(entry);

    } catch (err) {
      setError("Backend not responding.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analyzer">
      <MoodAnimation mood={mood} />

      <textarea
        placeholder="Tell me how you're feeling..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        maxLength={512}
      />

      <div className="meta">
        <span>{text.length}/512</span>
        <button onClick={analyze} disabled={loading || !text.trim()}>
          {loading ? "Analyzing..." : "Analyze →"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {result && <ResultCard result={result} />}
    </div>
  );
}

export default Analyzer;