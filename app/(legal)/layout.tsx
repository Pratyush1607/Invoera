import Link from "next/link";
import { Receipt } from "lucide-react";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white">
              <Receipt className="h-4 w-4" />
            </span>
            <span className="text-base font-bold text-gray-900 dark:text-gray-100">Invoera</span>
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-teal-600 hover:underline dark:text-teal-400"
          >
            Back to sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6 py-12">{children}</main>
    </div>
  );
}
