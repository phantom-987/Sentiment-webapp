function History({ history }) {
  if (history.length === 0) return null;

  return (
    <div className="history">
      <h3>Recent Analyses</h3>
      <ul>
        {history.map((item, i) => (
          <li key={i} className={item.label.toLowerCase()}>
            <span className="hist-label">{item.label === "POSITIVE" ? "😊" : "😞"} {item.label}</span>
            <span className="hist-score">{Math.round(item.score * 100)}%</span>
            <span className="hist-text">{item.text.slice(0, 60)}{item.text.length > 60 ? "..." : ""}</span>
            <span className="hist-time">{item.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default History;