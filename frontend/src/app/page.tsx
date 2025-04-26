"use client";

import Button from "./components/ui/Button";

export default function Home() {
  return (
    <div className="w-full grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Main content */}
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start min-h-70">
        <p className="text-lg text-center sm:text-left text-gray-600">
          AlgOracle is your go-to tool for analyzing, optimizing, and improving
          your codebase.
        </p>

        <h1 className="text-4xl sm:text-6xl font-bold text-center sm:text-left">
          Code Analysis using gemini1.5-pro
        </h1>

        <div className="flex">
          <Button
            onClick={() => (window.location.href = "/code-analysis")}
            variant="outline"
            size="lg"
          >
            Try it out!
          </Button>
        </div>
      </main>
    </div>
  );
}
