"use client";

import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import Markdown from "react-markdown";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";

// Reusable TabButton component
const TabButton = ({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`flex-1 py-2 text-center ${
      isActive
        ? "border-b-2 border-blue-500 text-blue-500"
        : "text-gray-600 dark:text-gray-400"
    }`}
  >
    {children}
  </button>
);

const CodeAnalysis = () => {
  const [language, setLanguage] = useState("python");
  const [result, setResult] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/analyze`, // Use environment variable
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, language }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze code");
      }

      const analysis = await response.json();

      setResult(JSON.stringify(analysis, null, 2));
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
          .map((opt: string) => `* ${opt}`)
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
          <TabButton
            isActive={activeTab === "editor"}
            onClick={() => setActiveTab("editor")}
          >
            Code Editor
          </TabButton>
          <TabButton
            isActive={activeTab === "result"}
            onClick={() => setActiveTab("result")}
          >
            Analysis
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
              />
            </svg>
          </TabButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          className={`flex flex-col ${
            activeTab === "editor" || !activeTab ? "block" : "hidden"
          } md:block md:h-[calc(90vh-10%)]`}
        >
          <div className="flex sm:flex-row items-start sm:items-center gap-4 mb-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full sm:w-[180px] border rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none shadow-sm"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>

            <Button
              onClick={handleAnalyze}
              variant="secondary"
              className="btn btn-primary"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? "Analyzing code..." : "Analyze"}

              <span className="ml-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </span>
            </Button>
          </div>

          <CodeMirror
            value={code}
            height="65vh"
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
          <div className="flex sm:flex-row items-start sm:items-center gap-4 mb-4">
            <br></br>
          </div>

          <div className="dark-container flex-grow overflow-auto p-4">
            {isAnalyzing && <Loader size={6} color="blue-500" />}

            {!isAnalyzing && renderAnalysisResult()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeAnalysis;
