"use client";

import { useEffect, useState } from "react";
import { UploadDropzone } from "@/components/upload/UploadDropzone";
import { ProcessingStepper, type Step } from "@/components/upload/ProcessingStepper";
import { ExtractedPreview, type ExtractedData, type SaveResult } from "@/components/upload/ExtractedPreview";
import { Card } from "@/components/ui/Card";
import { saveExpense } from "./actions";

const STEPS: Step[] = [
  { label: "Extracting data", description: "Reading text and line items from the file" },
  { label: "Validating fields", description: "Checking totals and required fields" },
  { label: "Categorizing expense", description: "Assigning the best-fit spending category" },
];

const DEMO_RESULTS: ExtractedData[] = [
  { merchant: "Blue Bottle Coffee", amount: 18, date: "2026-07-01", category: "Meals & Entertainment" },
  { merchant: "Staples", amount: 64, date: "2026-06-28", category: "Office Supplies" },
  { merchant: "United Airlines", amount: 412, date: "2026-06-25", category: "Travel" },
];

type Stage = "idle" | "processing" | "review";

export default function UploadPage() {
  const [stage, setStage] = useState<Stage>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ExtractedData | null>(null);

  useEffect(() => {
    if (stage !== "processing") return;
    if (stepIndex >= STEPS.length) {
      setResult(DEMO_RESULTS[Math.floor(Math.random() * DEMO_RESULTS.length)]);
      setStage("review");
      return;
    }
    const timer = setTimeout(() => setStepIndex((index) => index + 1), 900);
    return () => clearTimeout(timer);
  }, [stage, stepIndex]);

  function handleFileSelected(selected: File) {
    setFile(selected);
    setStepIndex(0);
    setStage("processing");
  }

  function reset() {
    setStage("idle");
    setStepIndex(0);
    setFile(null);
    setResult(null);
  }

  async function handleConfirm(data: ExtractedData): Promise<SaveResult> {
    if (!file) {
      return { success: false, error: "No file selected." };
    }
    return saveExpense({ file, ...data });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Upload</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Upload a receipt or invoice and let the AI pipeline handle the rest.
        </p>
      </div>

      {stage === "idle" && <UploadDropzone onFileSelected={handleFileSelected} />}

      {stage === "processing" && (
        <Card className="p-6">
          <p className="mb-6 text-sm text-gray-400 dark:text-gray-500">
            Processing{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-200">{file?.name}</span>
          </p>
          <ProcessingStepper steps={STEPS} currentIndex={stepIndex} />
        </Card>
      )}

      {stage === "review" && result && (
        <ExtractedPreview
          data={result}
          fileName={file?.name ?? ""}
          onConfirm={handleConfirm}
          onDiscard={reset}
        />
      )}
    </div>
  );
}
