"use client";

import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";

export default function CodeAnalysis() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [result, setResult] = useState("");

  const handleAnalyze = async () => {
    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language }),
      });
      const data = await response.json();
      setResult(data.result || "Analysis complete!");
    } catch (error) {
      console.error("Error analyzing code:", error);
      setResult("Error analyzing code.");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Code Analysis</h1>
      <p className="text-gray-600 mb-6">
        Type your code below in Python or JavaScript and click {"Analyze"} to
        get insights.
      </p>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Language:</label>
        <select
          className="border rounded p-2"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
      </div>
      <CodeMirror
        value={code}
        height="300px"
        extensions={[language === "javascript" ? javascript() : python()]}
        theme={oneDark}
        onChange={(value) => setCode(value)}
      />
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleAnalyze}
      >
        Analyze
      </button>
      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Analysis Result:</h2>
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
}
