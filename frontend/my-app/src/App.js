import { useState } from "react";
import Analyzer from "./components/Analyzer";
import History from "./components/History";
import "./App.css";

function App() {
  const [history, setHistory] = useState([]);

  const addToHistory = (entry) => {
    setHistory((prev) => [entry, ...prev].slice(0, 10));
  };

  return (
    <div className="app">
      <header>
        <h1>SENTIMENT<span>AI</span></h1>
        <p>Analyze the emotion behind any text instantly</p>
      </header>
      <main>
        <Analyzer onResult={addToHistory} />
        <History history={history} />
      </main>
    </div>
  );
}

export default App;
