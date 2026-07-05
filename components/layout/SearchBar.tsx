"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { searchAction, type SearchResult } from "@/app/(app)/search/actions";
import { formatCurrency } from "@/lib/utils";

const EMPTY_RESULT: SearchResult = { clients: [], invoices: [] };

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>(EMPTY_RESULT);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 1) {
      setResults(EMPTY_RESULT);
      return;
    }
    const timeout = setTimeout(() => {
      startTransition(async () => {
        const data = await searchAction(trimmed);
        setResults(data);
      });
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  const hasResults = results.clients.length > 0 || results.invoices.length > 0;
  const showDropdown = open && query.trim().length > 0;

  function goTo(path: string) {
    setOpen(false);
    setQuery("");
    router.push(path);
  }

  return (
    <div ref={containerRef} className="relative hidden sm:block sm:w-72">
      <div className="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-sm dark:bg-gray-800">
        <Search className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
          maxLength={100}
          placeholder="Search invoices, clients..."
          className="w-full bg-transparent text-gray-700 outline-none placeholder:text-gray-400 dark:text-gray-200 dark:placeholder:text-gray-500"
        />
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-gray-100 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          {isPending && (
            <p className="px-3 py-2 text-xs text-gray-400 dark:text-gray-500">Searching…</p>
          )}

          {!isPending && !hasResults && (
            <p className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500">No results found.</p>
          )}

          {results.clients.length > 0 && (
            <div className="mb-1">
              <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Clients
              </p>
              {results.clients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => goTo(`/clients/${client.id}`)}
                  className="flex w-full flex-col rounded-xl px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <span className="font-medium text-gray-900 dark:text-gray-100">{client.name}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{client.location}</span>
                </button>
              ))}
            </div>
          )}

          {results.invoices.length > 0 && (
            <div>
              <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Invoices
              </p>
              {results.invoices.map((invoice) => (
                <button
                  key={invoice.id}
                  type="button"
                  onClick={() => goTo(`/clients/${invoice.clientId}`)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate font-medium text-gray-900 dark:text-gray-100">
                      {invoice.number} — {invoice.description}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{invoice.clientName}</span>
                  </span>
                  <span className="shrink-0 font-semibold text-gray-700 dark:text-gray-300">
                    {formatCurrency(invoice.amount, invoice.currency)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
