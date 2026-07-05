"use client";

import { useActionState, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { updateProfileAction, type ProfileFormState } from "@/app/(app)/settings/actions";
import { getInitials } from "@/lib/utils";

const initialState: ProfileFormState = {};

const inputClassName =
  "rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-teal-500/20";

export function ProfileCard({ displayName, email }: { displayName: string; email: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [state, formAction, pending] = useActionState(updateProfileAction, initialState);

  useEffect(() => {
    if (state.message && !state.error) {
      setIsEditing(false);
    }
  }, [state]);

  if (!isEditing) {
    return (
      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar initials={getInitials(displayName)} color="#0d9488" size={56} />
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{displayName}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">{email}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Button variant="secondary" onClick={() => setIsEditing(true)}>
            Edit profile
          </Button>
          {state.message && !state.error && (
            <p className="text-xs text-teal-600 dark:text-teal-400">{state.message}</p>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5" key={`${displayName}-${email}`}>
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Avatar initials={getInitials(displayName)} color="#0d9488" size={56} />
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <label className="flex flex-1 flex-col gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              Display name
              <input
                name="displayName"
                type="text"
                required
                defaultValue={displayName}
                className={inputClassName}
              />
            </label>
            <label className="flex flex-1 flex-col gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
              <input
                name="email"
                type="email"
                required
                defaultValue={email}
                className={inputClassName}
              />
            </label>
          </div>
        </div>

        {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            disabled={pending}
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
