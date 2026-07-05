import { createPartFromBase64, createUserContent } from "@google/genai";
import { getGeminiClient, GEMINI_MODEL } from "./client";
import { SUPPORTED_CURRENCIES } from "@/lib/constants";
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

const CURRENCY_PROMPT_HINT = `the ISO 4217 currency code the amount is in (guessed from symbols/text on the document), one of: ${SUPPORTED_CURRENCIES.join(", ")}`;

function normalizeCurrency(
  guess: string,
  fallback: string,
  issues: string[]
): string {
  const upper = guess?.toUpperCase();
  if ((SUPPORTED_CURRENCIES as readonly string[]).includes(upper)) {
    return upper;
  }
  issues.push(`Couldn't confidently detect the currency (guessed "${guess}") — defaulted to ${fallback}.`);
  return fallback;
}

export interface ExtractedFields {
  merchant: string;
  amount: number;
  currency: string;
  date: string;
  rawText: string;
}

export interface ValidatedFields {
  merchant: string;
  amount: number;
  currency: string;
  date: string;
  isValid: boolean;
  issues: string[];
}

function parseJsonResponse<T>(text: string | undefined, stage: string): T {
  if (!text) {
    throw new Error(`${stage} agent returned no output.`);
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`${stage} agent returned malformed output.`);
  }
}

export interface StageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function toErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export async function extractAgent(fileBase64: string, mimeType: string): Promise<ExtractedFields> {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      createUserContent([
        `You are a receipt and invoice data extraction agent. Look at the attached file and extract the merchant name, the total amount charged (as a plain number, no currency symbols or commas), ${CURRENCY_PROMPT_HINT}, and the transaction date in strict ISO 8601 format (YYYY-MM-DD). Also include any other useful details you notice as rawText. If a field truly cannot be determined, make your best reasonable guess rather than leaving it blank.`,
        createPartFromBase64(fileBase64, mimeType),
      ]),
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          merchant: { type: "string" },
          amount: { type: "number" },
          currency: { type: "string", enum: [...SUPPORTED_CURRENCIES] },
          date: { type: "string" },
          rawText: { type: "string" },
        },
        required: ["merchant", "amount", "currency", "date", "rawText"],
      },
    },
  });

  return parseJsonResponse<ExtractedFields>(response.text, "Extraction");
}

export async function validateAgent(
  fields: ExtractedFields,
  displayCurrency: string
): Promise<ValidatedFields> {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      createUserContent(
        `You are a validation agent for expense data extracted from a receipt. Review these extracted fields and normalize them:\n\n${JSON.stringify(fields, null, 2)}\n\nNormalize the date to strict ISO 8601 (YYYY-MM-DD). Ensure amount is a positive plain number. Clean up the merchant name (trim whitespace, sensible capitalization). Ensure currency is one of: ${SUPPORTED_CURRENCIES.join(", ")} — if genuinely unclear, keep the extracted guess as-is. List any issues you find (e.g. missing merchant, implausible amount, ambiguous date) in the issues array — an empty array means everything looks correct.`
      ),
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          merchant: { type: "string" },
          amount: { type: "number" },
          currency: { type: "string" },
          date: { type: "string" },
          isValid: { type: "boolean" },
          issues: { type: "array", items: { type: "string" } },
        },
        required: ["merchant", "amount", "currency", "date", "isValid", "issues"],
      },
    },
  });

  const result = parseJsonResponse<ValidatedFields>(response.text, "Validation");
  const issues = [...result.issues];
  const currency = normalizeCurrency(result.currency, displayCurrency, issues);
  return { ...result, currency, issues };
}

export async function categorizeAgent(fields: ValidatedFields): Promise<ExpenseCategory> {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      createUserContent(
        `You are a categorization agent for business expenses. Given this expense, assign the single best-fit category from this exact list: ${CATEGORIES.join(", ")}.\n\nExpense: merchant "${fields.merchant}", amount ${fields.amount} ${fields.currency}.`
      ),
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          category: { type: "string", enum: CATEGORIES },
        },
        required: ["category"],
      },
    },
  });

  const result = parseJsonResponse<{ category: string }>(response.text, "Categorization");
  return CATEGORIES.includes(result.category as ExpenseCategory)
    ? (result.category as ExpenseCategory)
    : "Professional Services";
}

export interface ExtractedInvoiceFields {
  number: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  dueDate: string;
  rawText: string;
}

export interface ValidatedInvoiceFields {
  number: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  dueDate: string;
  isValid: boolean;
  issues: string[];
}

export async function extractInvoiceAgent(
  fileBase64: string,
  mimeType: string
): Promise<ExtractedInvoiceFields> {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      createUserContent([
        `You are an invoice data extraction agent. Look at the attached invoice document and extract: the invoice number (if visible, otherwise an empty string), a short one-line description of the work or goods billed, the total amount charged (as a plain number, no currency symbols or commas), ${CURRENCY_PROMPT_HINT}, the invoice/issue date in strict ISO 8601 format (YYYY-MM-DD), and the due date in strict ISO 8601 format (YYYY-MM-DD) — if no due date is printed, estimate it as 30 days after the issue date. Also include any other useful details you notice as rawText.`,
        createPartFromBase64(fileBase64, mimeType),
      ]),
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          number: { type: "string" },
          description: { type: "string" },
          amount: { type: "number" },
          currency: { type: "string", enum: [...SUPPORTED_CURRENCIES] },
          date: { type: "string" },
          dueDate: { type: "string" },
          rawText: { type: "string" },
        },
        required: ["number", "description", "amount", "currency", "date", "dueDate", "rawText"],
      },
    },
  });

  return parseJsonResponse<ExtractedInvoiceFields>(response.text, "Invoice extraction");
}

export async function validateInvoiceAgent(
  fields: ExtractedInvoiceFields,
  displayCurrency: string
): Promise<ValidatedInvoiceFields> {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      createUserContent(
        `You are a validation agent for invoice data extracted from a document. Review these extracted fields and normalize them:\n\n${JSON.stringify(fields, null, 2)}\n\nNormalize both dates to strict ISO 8601 (YYYY-MM-DD), ensure the due date is not before the issue date, ensure amount is a positive plain number, clean up the description (trim whitespace, sensible capitalization), and ensure currency is one of: ${SUPPORTED_CURRENCIES.join(", ")} — if genuinely unclear, keep the extracted guess as-is. List any issues you find (e.g. missing invoice number, implausible amount, ambiguous dates) in the issues array — an empty array means everything looks correct.`
      ),
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          number: { type: "string" },
          description: { type: "string" },
          amount: { type: "number" },
          currency: { type: "string" },
          date: { type: "string" },
          dueDate: { type: "string" },
          isValid: { type: "boolean" },
          issues: { type: "array", items: { type: "string" } },
        },
        required: [
          "number",
          "description",
          "amount",
          "currency",
          "date",
          "dueDate",
          "isValid",
          "issues",
        ],
      },
    },
  });

  const result = parseJsonResponse<ValidatedInvoiceFields>(response.text, "Invoice validation");
  const issues = [...result.issues];
  const currency = normalizeCurrency(result.currency, displayCurrency, issues);
  return { ...result, currency, issues };
}
