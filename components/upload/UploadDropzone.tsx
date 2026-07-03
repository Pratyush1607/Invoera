"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

export function UploadDropzone({ onFileSelected }: { onFileSelected: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files?.[0];
        if (file) onFileSelected(file);
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") inputRef.current?.click();
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-colors",
        isDragging
          ? "border-teal-500 bg-teal-50 dark:bg-teal-500/10"
          : "border-gray-200 bg-white hover:border-teal-300 hover:bg-teal-50/40 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-teal-600 dark:hover:bg-teal-500/5"
      )}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400">
        <UploadCloud className="h-6 w-6" />
      </span>
      <div>
        <p className="font-semibold text-gray-900 dark:text-gray-100">
          Drop a receipt or invoice here
        </p>
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
          or click to browse — PDF, JPG, or PNG
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFileSelected(file);
        }}
      />
    </div>
  );
}
