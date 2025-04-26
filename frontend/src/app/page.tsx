"use client";

import React from "react";
import Button from "./components/ui/Button";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[80vh] p-8 font-[family-name:var(--font-geist-sans)]">
      {/* Main content */}
      <main className="flex flex-col gap-8 items-center max-w-3xl">
        <p className="text-lg text-center text-gray-400">
          AlgOracle is your go-to tool for analyzing, optimizing, and improving
          your codebase.
        </p>

        <h1 className="text-4xl sm:text-6xl font-bold text-center">
          Code Analysis using gemini1.5-pro
        </h1>

        <div className="flex justify-center">
          <Button
            onClick={() => (window.location.href = "/code-analysis")}
            variant="ghost"
            size="2xl"
            className="btn btn-primary b-none text-gray-100"
          >
            Try it out!
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
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                />
              </svg>
            </span>
          </Button>
        </div>
      </main>
    </div>
  );
}
