"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { UploadDropzone } from "@/components/upload/UploadDropzone";
import { ProcessingStepper, type Step } from "@/components/upload/ProcessingStepper";
import {
  createInvoiceAction,
  runExtractInvoiceStage,
  runValidateInvoiceStage,
  type InvoiceFormState,
} from "@/app/(app)/clients/actions";
import type { ValidatedInvoiceFields } from "@/lib/gemini/pipeline";
import { SUPPORTED_CURRENCIES } from "@/lib/constants";

const initialState: InvoiceFormState = {};

const inputClassName =
  "rounded-[var(--radius-input)] border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20";

const STEPS: Step[] = [
  { label: "Extracting data", description: "Reading fields from the invoice document" },
  { label: "Validating fields", description: "Checking dates and totals" },
];

type Mode = "manual" | "upload" | "processing" | "review" | "error";

export function NewInvoiceForm({ clientId, clientName }: { clientId: string; clientName: string }) {
  const action = createInvoiceAction.bind(null, clientId);
  const [state, formAction, pending] = useActionState(action, initialState);

  const [mode, setMode] = useState<Mode>("manual");
  const [stepIndex, setStepIndex] = useState(0);
  const [fileName, setFileName] = useState("");
  const [review, setReview] = useState<ValidatedInvoiceFields | null>(null);
  const [pipelineError, setPipelineError] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();

  async function runPipeline(file: File) {
    setFileName(file.name);
    setStepIndex(0);
    setMode("processing");

    const extracted = await runExtractInvoiceStage(file);
    if (!extracted.success || !extracted.data) {
      setPipelineError(extracted.error ?? "Couldn't read that file.");
      setMode("error");
      return;
    }
    setStepIndex(1);

    const validated = await runValidateInvoiceStage(extracted.data);
    if (!validated.success || !validated.data) {
      setPipelineError(validated.error ?? "Couldn't validate the extracted data.");
      setMode("error");
      return;
    }

    setReview(validated.data);
    setMode("review");
  }

  function handleSave() {
    if (!review) return;
    setSaveError(null);
    startSaving(async () => {
      const formData = new FormData();
      formData.set("number", review.number);
      formData.set("description", review.description);
      formData.set("date", review.date);
      formData.set("dueDate", review.dueDate);
      formData.set("amount", String(review.amount));
      formData.set("currency", review.currency);
      formData.set("status", "pending");
      const result = await createInvoiceAction(clientId, {}, formData);
      if (result?.error) setSaveError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/clients/${clientId}`}
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted hover:text-text"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {clientName}
      </Link>

      <div>
        <h1 className="font-display text-2xl font-bold text-text">New Invoice</h1>
        <p className="text-sm text-muted">For {clientName}</p>
      </div>

      {mode === "manual" && (
        <>
          <button
            type="button"
            onClick={() => setMode("upload")}
            className="w-fit text-sm font-semibold text-accent hover:opacity-80"
          >
            Upload an invoice document instead
          </button>

          <form action={formAction} className="flex max-w-md flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
              Invoice number
              <input
                name="number"
                type="text"
                required
                placeholder="INV-1042"
                className={inputClassName}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
              Description
              <input
                name="description"
                type="text"
                required
                placeholder="Website redesign"
                className={inputClassName}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
              Date
              <input name="date" type="date" required className={inputClassName} />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
              Due date
              <input name="dueDate" type="date" required className={inputClassName} />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
              Amount
              <input
                name="amount"
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="1200"
                className={inputClassName}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
              Currency
              <select name="currency" defaultValue="USD" className={inputClassName}>
                {SUPPORTED_CURRENCIES.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
              Status
              <select name="status" defaultValue="pending" className={inputClassName}>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </label>

            {state.error && <p className="text-sm text-danger">{state.error}</p>}

            <Button type="submit" disabled={pending} className="mt-2 w-full">
              {pending ? "Adding…" : "Add Invoice"}
            </Button>
          </form>
        </>
      )}

      {mode === "upload" && (
        <>
          <button
            type="button"
            onClick={() => setMode("manual")}
            className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-muted hover:text-text"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to manual entry
          </button>
          <UploadDropzone onFileSelected={runPipeline} />
        </>
      )}

      {mode === "processing" && (
        <Card className="p-6">
          <p className="mb-6 text-sm text-muted">
            Processing <span className="font-semibold text-text">{fileName}</span>
          </p>
          <ProcessingStepper steps={STEPS} currentIndex={stepIndex} />
        </Card>
      )}

      {mode === "error" && (
        <Card className="flex flex-col items-center gap-3 p-10 text-center">
          <p className="font-semibold text-text">Something went wrong</p>
          <p className="text-sm text-muted">{pipelineError}</p>
          <Button variant="secondary" onClick={() => setMode("upload")}>
            Try again
          </Button>
        </Card>
      )}

      {mode === "review" && review && (
        <Card className="p-5">
          <h3 className="font-display font-bold text-text">Review extracted details</h3>
          <p className="text-sm text-muted">From {fileName} — confirm before saving.</p>

          {review.issues.length > 0 && (
            <div className="mt-4 flex gap-2 rounded-xl bg-warning/15 p-3 text-sm text-warning">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold">The AI pipeline flagged this for review</p>
                <ul className="mt-1 list-disc pl-4">
                  {review.issues.map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
              Invoice number
              <input
                value={review.number}
                onChange={(event) => setReview({ ...review, number: event.target.value })}
                className={inputClassName}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
              Description
              <input
                value={review.description}
                onChange={(event) => setReview({ ...review, description: event.target.value })}
                className={inputClassName}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
              Date
              <input
                type="date"
                value={review.date}
                onChange={(event) => setReview({ ...review, date: event.target.value })}
                className={inputClassName}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
              Due date
              <input
                type="date"
                value={review.dueDate}
                onChange={(event) => setReview({ ...review, dueDate: event.target.value })}
                className={inputClassName}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
              Amount
              <input
                type="number"
                value={review.amount}
                onChange={(event) => setReview({ ...review, amount: Number(event.target.value) })}
                className={inputClassName}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
              Currency
              <select
                value={review.currency}
                onChange={(event) => setReview({ ...review, currency: event.target.value })}
                className={inputClassName}
              >
                {SUPPORTED_CURRENCIES.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {saveError && <p className="mt-4 text-sm text-danger">{saveError}</p>}

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setMode("upload")} disabled={isSaving}>
              Discard
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving…" : "Save invoice"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
