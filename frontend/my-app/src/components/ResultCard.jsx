function ResultCard({ result }) {
  const isPositive = result.label === "POSITIVE";

  return (
    <div className={`result-card ${isPositive ? "positive" : "negative"}`}>
      
      <div className="result-top">
        <div className="emoji">
          {isPositive ? "😊" : "😔"}
        </div>

        <div>
          <h2>
            {isPositive ? "Positive Energy" : "Heavy Emotion"}
          </h2>
          <p>Confidence: {result.score}</p>
        </div>
      </div>

      <div className="meter-bar">
        <div
          className="meter-fill"
          style={{ width: `${result.score * 100}%` }}
        />
      </div>

      <p className="analyzed-text">"{result.text}"</p>

      {result.response && (
        <div className="reason-card">
          <span className="reason-label">Response</span>
          <p className="reason-text">{result.response}</p>
        </div>
      )}
    </div>
  );
}

export default ResultCard;