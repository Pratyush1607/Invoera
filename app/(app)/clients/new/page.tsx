"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClientAction, type ClientFormState } from "../actions";
import { inputClassName } from "@/lib/ui-classes";

const initialState: ClientFormState = {};

export default function NewClientPage() {
  const [state, formAction, pending] = useActionState(createClientAction, initialState);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/clients"
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted hover:text-text"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to clients
      </Link>

      <div>
        <h1 className="font-display text-2xl font-bold text-text">Add Client</h1>
        <p className="text-sm text-muted">Add a customer you send invoices to.</p>
      </div>

      <form action={formAction} className="flex max-w-md flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
          Client name
          <input
            name="name"
            type="text"
            required
            placeholder="Acme Studio"
            className={inputClassName}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
          Location
          <input
            name="location"
            type="text"
            required
            placeholder="Austin, TX"
            className={inputClassName}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
          Status
          <select name="status" defaultValue="active" className={inputClassName}>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </label>

        {state.error && <p className="text-sm text-danger">{state.error}</p>}

        <Button type="submit" disabled={pending} className="mt-2 w-full">
          {pending ? "Adding…" : "Add Client"}
        </Button>
      </form>
    </div>
  );
}
