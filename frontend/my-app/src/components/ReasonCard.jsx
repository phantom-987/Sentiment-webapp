import { useState, useEffect } from "react";

function ReasonCard({ result }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!result) return;
    setReason("");
    setLoading(true);

    const fetchReason = async () => {
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 100,
            messages: [
              {
                role: "user",
                content: `The following text was analyzed as ${result.label} with ${Math.round(result.score * 100)}% confidence. In exactly one short sentence (max 20 words), explain why. Text: "${result.text}"`,
              },
            ],
          }),
        });

        const data = await response.json();
        setReason(data.content?.[0]?.text || "Could not generate reason.");
      } catch (err) {
        setReason("Could not generate reason.");
      } finally {
        setLoading(false);
      }
    };

    fetchReason();
  }, [result]);

  if (!result) return null;

  return (
    <div className="reason-card">
      <span className="reason-label">Why?</span>
      {loading ? (
        <span className="reason-loading">Thinking...</span>
      ) : (
        <p className="reason-text">{reason}</p>
      )}
    </div>
  );
}

export default ReasonCard;