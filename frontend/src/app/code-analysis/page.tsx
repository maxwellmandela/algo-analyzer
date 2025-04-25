"use client";

import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import Markdown from "react-markdown";

const CodeAnalysis = () => {
  const [language, setLanguage] = useState("python");
  const [result, setResult] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // sample code snippet
  const [code, setCode] = useState(`def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)
  `);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze code");
      }

      const analysis = await response.json();
      setResult(JSON.stringify(analysis, null, 2)); // Store raw JSON
    } catch (error) {
      console.error("Error analyzing code:", error);
      setResult("Error analyzing code.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Function to render the analysis result
  const renderAnalysisResult = () => {
    if (!result) {
      return (
        <p className="text-gray-700 dark:text-gray-300">
          No analysis result yet. Run analysis to see results.
        </p>
      );
    }

    try {
      const analysis = JSON.parse(result); // Parse the JSON string
      const markdownSummary = analysis.summary.replace(/\n/g, "<br />");

      let markdownOptimizations = "";
      if (analysis.optimizations && Array.isArray(analysis.optimizations)) {
        markdownOptimizations = analysis.optimizations
          .map((opt: string) => `- ${opt}`)
          .join("\n");
      } else {
        markdownOptimizations = "No optimizations suggested.";
      }

      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Summary
          </h3>
          <Markdown>{markdownSummary}</Markdown>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Time Complexity
              </h3>
              <p className="text-green-600 dark:text-green-400">
                {analysis.time_complexity}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Space Complexity
              </h3>
              <p className="text-green-600 dark:text-green-400">
                {analysis.space_complexity}
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Optimizations
          </h3>
          <Markdown>{markdownOptimizations}</Markdown>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Language
          </h3>
          <p className="text-blue-600 dark:text-blue-400">
            {analysis.language}
          </p>
        </div>
      );
    } catch (error) {
      // If parsing fails, display the raw JSON (fallback)
      console.error("Error parsing analysis result:", error);
      return (
        <pre className="text-gray-700 dark:text-gray-300 font-mono">
          {result}
        </pre>
      );
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Code Editor */}
        <div className="flex flex-col">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full sm:w-[180px] border rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none shadow-sm"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </button>
          </div>

          <CodeMirror
            value={code}
            height="400px"
            extensions={[language === "javascript" ? javascript() : python()]}
            theme={oneDark}
            onChange={(value) => setCode(value)}
            className="rounded-md shadow-lg border border-gray-200 dark:border-gray-700"
          />
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Type your code above in Python or JavaScript and click {"Analyze"}{" "}
            to get insights.
          </p>
        </div>

        {/* Right Column: Result */}

        <div className="flex flex-col">
          <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md min-h-[200px]">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Analysis Result:
            </h2>

            {isAnalyzing && (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}

            {!isAnalyzing && renderAnalysisResult()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeAnalysis;
