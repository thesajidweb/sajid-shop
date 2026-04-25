"use client";

import React, { useState, useRef, useCallback } from "react";

interface DragAndDropProps {
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  onFilesSelected: (files: FileList) => void;
  className?: string;
  children?: React.ReactNode; // optional content inside drop area
}

/**
 * A React component that allows users to drag and drop files into a designated area.
 * The component can be configured to accept multiple files, specific file types, and can be disabled.
 * When a user drops files into the designated area, the component will call the onFilesSelected function with the list of files.
 * The component can also be clicked to open a file input dialog.
 */
export default function DragAndDrop({
  /**
   * Whether the component should accept multiple files.
   */
  multiple = false,
  /**
   * A comma-separated list of file types that the component should accept.
   */
  accept = "*",
  /**
   * Whether the component should be disabled.
   */
  disabled = false,
  /**
   * A function that will be called when the user drops files into the designated area.
   * The function will be called with a list of files as an argument.
   */
  onFilesSelected,
  /**
   * An optional class name to apply to the component.
   */
  className = "",
  /**
   * Optional children to render inside the drop area.
   */
  children,
}: DragAndDropProps) {
  /**
   * A state variable to track whether the user is currently dragging a file over the component.
   */
  const [dragOver, setDragOver] = useState(false);

  /**
   * A reference to the file input element.
   */
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * A function to handle when the user drags a file over the component.
   * Sets the dragOver state to true.
   */
  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      onFilesSelected(files);
    },
    [onFilesSelected],
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  /**
   * A function to handle when the user stops dragging a file over the component.
   * Sets the dragOver state to false.
   */
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  /**
   * A function to handle when the user drops a file into the designated area.
   * Sets the dragOver state to false and calls the onFilesSelected function with the list of files.
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  /**
   * A function to handle when the user clicks on the component.
   * If the component is not disabled, opens a file input dialog.
   */
  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${
        dragOver ? "border-primary bg-primary/10" : "border-muted-foreground/25"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      {children}
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
