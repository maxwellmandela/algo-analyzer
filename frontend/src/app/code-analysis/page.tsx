"use client";

import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import Markdown from "react-markdown";
import Button from "../components/ui/Button";

const CodeAnalysis = () => {
  const [language, setLanguage] = useState("python");
  const [result, setResult] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("editor"); // Track active tab for small devices

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
          <h3 className="heading-lg">Summary</h3>
          <Markdown>{markdownSummary}</Markdown>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="heading-lg">Time Complexity</h3>
              <p className="text-success">{analysis.time_complexity}</p>
            </div>
            <div>
              <h3 className="heading-lg">Space Complexity</h3>
              <p className="text-success">{analysis.space_complexity}</p>
            </div>
          </div>

          <h3 className="heading-lg">Optimizations</h3>
          <Markdown>{markdownOptimizations}</Markdown>
          <h3 className="heading-lg">Language</h3>
          <p className="text-info">{analysis.language}</p>
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
      {/* Tabs for small devices */}
      <div className="block md:hidden mb-4">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("editor")}
            className={`flex-1 py-2 text-center ${
              activeTab === "editor"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Code Editor
          </button>
          <button
            onClick={() => setActiveTab("result")}
            className={`flex-1 py-2 text-center ${
              activeTab === "result"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Analysis Result
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Code Editor */}
        <div
          className={`flex flex-col ${
            activeTab === "editor" || !activeTab ? "block" : "hidden"
          } md:block md:h-[calc(90vh-10%)]`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full sm:w-[180px] border rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none shadow-sm"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
          </div>

          <CodeMirror
            value={code}
            height="100%"
            extensions={[language === "javascript" ? javascript() : python()]}
            theme={oneDark}
            onChange={(value) => setCode(value)}
            className="rounded-md shadow-lg border border-gray-200 dark:border-gray-700 flex-grow"
          />
          <p className="text-primary mb-6">
            Type your code above in Python or JavaScript and click {"Analyze"}{" "}
            to get insights.
          </p>
        </div>

        {/* Right Column: Result */}
        <div
          className={`flex flex-col ${
            activeTab === "result" || !activeTab ? "block" : "hidden"
          } md:block md:h-[calc(90vh-10%)]`}
        >
          <Button
            onClick={handleAnalyze}
            variant="secondary"
            disabled={isAnalyzing}
            className="mb-4"
          >
            Analyze
          </Button>

          <div className="dark-container flex-grow overflow-auto p-4">
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
