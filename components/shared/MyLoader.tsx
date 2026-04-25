"use client";

import { Loader } from "lucide-react";

interface LoadingStateProps {
  text?: string;
}

const MyLoader = ({ text = "Loading..." }: LoadingStateProps) => {
  return (
    <div className="w-full h-[90vh] flex flex-col items-center justify-center gap-4">
      <Loader className="w-12 h-12 animate-spin " />
      {text && (
        <p className="text-base font-medium text-muted-foreground">{text}</p>
      )}
    </div>
  );
};

export default MyLoader;
