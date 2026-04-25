"use client";
import React from "react";

interface ProgressOverlayProps {
  isVisible: boolean;
  total: number;
  current: number;
  percentage: number;
}

export const ProgressOverlay: React.FC<ProgressOverlayProps> = ({
  isVisible,
  total,
  current,
  percentage,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-100 flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-foreground uppercase tracking-tight italic">
            Uploading Inventory Assets
          </h3>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Processing item {current} of {total}
          </p>
        </div>

        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-black inline-block py-1 px-2 uppercase rounded-full text-primary-foreground bg-primary shadow-sm">
                In Progress
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-black inline-block text-primary">
                {percentage}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-secondary border border-border shadow-inner">
            <div
              style={{ width: `${percentage}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-300 ease-out"
            ></div>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground uppercase font-black animate-pulse">
          Syncing with secure global registry...
        </p>
      </div>
    </div>
  );
};
