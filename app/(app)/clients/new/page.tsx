"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClientAction, type ClientFormState } from "../actions";

const initialState: ClientFormState = {};

const inputClassName =
  "rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-teal-500/20";

export default function NewClientPage() {
  const [state, formAction, pending] = useActionState(createClientAction, initialState);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/clients"
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to clients
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Add Client</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Add a customer you send invoices to.
        </p>
      </div>

      <form action={formAction} className="flex max-w-md flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
          Client name
          <input
            name="name"
            type="text"
            required
            placeholder="Acme Studio"
            className={inputClassName}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
          Location
          <input
            name="location"
            type="text"
            required
            placeholder="Austin, TX"
            className={inputClassName}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
          Status
          <select name="status" defaultValue="active" className={inputClassName}>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </label>

        {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}

        <Button type="submit" disabled={pending} className="mt-2 w-full">
          {pending ? "Adding…" : "Add Client"}
        </Button>
      </form>
    </div>
  );
}
