"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { UploadDropzone } from "@/components/upload/UploadDropzone";
import { ProcessingStepper, type Step } from "@/components/upload/ProcessingStepper";
import { ExtractedPreview, type ExtractedData, type SaveResult } from "@/components/expenses/ExtractedPreview";
import {
  createExpenseAction,
  saveExpense,
  runExtractStage,
  runValidateStage,
  runCategorizeStage,
  type ExpenseFormState,
} from "@/app/(app)/expenses/actions";
import type { ExpenseCategory } from "@/lib/types";

const CATEGORIES: ExpenseCategory[] = [
  "Software",
  "Travel",
  "Office Supplies",
  "Meals & Entertainment",
  "Marketing",
  "Professional Services",
  "Utilities",
  "Equipment",
];

const initialState: ExpenseFormState = {};

const inputClassName =
  "rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-teal-500/20";

const STEPS: Step[] = [
  { label: "Extracting data", description: "Reading text and line items from the file" },
  { label: "Validating fields", description: "Checking totals and required fields" },
  { label: "Categorizing expense", description: "Assigning the best-fit spending category" },
];

type Mode = "manual" | "upload" | "processing" | "review" | "error";

export function NewExpenseForm() {
  const [state, formAction, pending] = useActionState(createExpenseAction, initialState);

  const [mode, setMode] = useState<Mode>("manual");
  const [stepIndex, setStepIndex] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ExtractedData | null>(null);
  const [issues, setIssues] = useState<string[]>([]);
  const [pipelineError, setPipelineError] = useState("");

  async function runPipeline(selected: File) {
    setFile(selected);
    setStepIndex(0);
    setMode("processing");

    const extracted = await runExtractStage(selected);
    if (!extracted.success || !extracted.data) {
      setPipelineError(extracted.error ?? "Couldn't read that file.");
      setMode("error");
      return;
    }
    setStepIndex(1);

    const validated = await runValidateStage(extracted.data);
    if (!validated.success || !validated.data) {
      setPipelineError(validated.error ?? "Couldn't validate the extracted data.");
      setMode("error");
      return;
    }
    setStepIndex(2);

    const categorized = await runCategorizeStage(validated.data);
    if (!categorized.success || !categorized.data) {
      setPipelineError(categorized.error ?? "Couldn't categorize the expense.");
      setMode("error");
      return;
    }

    setIssues(validated.data.issues);
    setResult({
      merchant: validated.data.merchant,
      amount: validated.data.amount,
      date: validated.data.date,
      category: categorized.data.category,
    });
    setMode("review");
  }

  async function handleConfirm(data: ExtractedData): Promise<SaveResult> {
    if (!file) {
      return { success: false, error: "No file selected." };
    }
    return saveExpense({
      file,
      ...data,
      status: issues.length > 0 ? "needs review" : "processed",
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/expenses"
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to expenses
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">New Expense</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Fill it out manually, or upload a receipt and let the AI pipeline handle the rest.
        </p>
      </div>

      {mode === "manual" && (
        <>
          <button
            type="button"
            onClick={() => setMode("upload")}
            className="w-fit text-sm font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
          >
            Upload a receipt instead
          </button>

          <form action={formAction} className="flex max-w-md flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              Merchant
              <input
                name="merchant"
                type="text"
                required
                placeholder="Adobe Creative Cloud"
                className={inputClassName}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
              <select name="category" defaultValue={CATEGORIES[0]} className={inputClassName}>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              Date
              <input name="date" type="date" required className={inputClassName} />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              Amount
              <input
                name="amount"
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="55"
                className={inputClassName}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
              <select name="status" defaultValue="processed" className={inputClassName}>
                <option value="processed">Processed</option>
                <option value="needs review">Needs Review</option>
              </select>
            </label>

            {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}

            <Button type="submit" disabled={pending} className="mt-2 w-full">
              {pending ? "Adding…" : "Add Expense"}
            </Button>
          </form>
        </>
      )}

      {mode === "upload" && (
        <>
          <button
            type="button"
            onClick={() => setMode("manual")}
            className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to manual entry
          </button>
          <UploadDropzone onFileSelected={runPipeline} />
        </>
      )}

      {mode === "processing" && (
        <Card className="p-6">
          <p className="mb-6 text-sm text-gray-400 dark:text-gray-500">
            Processing <span className="font-semibold text-gray-700 dark:text-gray-200">{file?.name}</span>
          </p>
          <ProcessingStepper steps={STEPS} currentIndex={stepIndex} />
        </Card>
      )}

      {mode === "error" && (
        <Card className="flex flex-col items-center gap-3 p-10 text-center">
          <p className="font-semibold text-gray-900 dark:text-gray-100">Something went wrong</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">{pipelineError}</p>
          <Button variant="secondary" onClick={() => setMode("upload")}>
            Try again
          </Button>
        </Card>
      )}

      {mode === "review" && result && (
        <ExtractedPreview
          data={result}
          fileName={file?.name ?? ""}
          issues={issues}
          onConfirm={handleConfirm}
          onDiscard={() => setMode("upload")}
        />
      )}
    </div>
  );
}
