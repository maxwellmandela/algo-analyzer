import React from "react";

interface LoaderProps {
  size?: number; // Size of the loader (default: 8)
  color?: string; // Color of the loader (default: blue-500)
}

const Loader: React.FC<LoaderProps> = ({ size = 8, color = "blue-500" }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-${color}`}
        style={{ height: `${size * 4}px`, width: `${size * 4}px` }}
      ></div>
    </div>
  );
};

export default Loader;
