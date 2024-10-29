import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-16 h-16 border-2 border-t-2 border-t-violet-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;
