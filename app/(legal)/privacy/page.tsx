import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Invoera",
};

const h2 = "mt-8 text-lg font-bold text-gray-900 dark:text-gray-100";
const p = "mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300";
const ul = "mt-3 flex flex-col gap-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300";
const li = "flex gap-2 before:mt-2 before:h-1 before:w-1 before:shrink-0 before:rounded-full before:bg-teal-500";

export default function PrivacyPolicyPage() {
  return (
    <article>
      <p className="text-xs font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400">
        Legal
      </p>
      <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">Privacy Policy</h1>
      <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">Last updated: July 6, 2026</p>

      <p className={p}>
        This policy explains what information Invoera ("we", "us") collects when you use the
        app, how it&apos;s used, and who it&apos;s shared with. Invoera is an invoicing and
        expense-tracking tool that uses AI to help extract and organize data from documents you
        upload.
      </p>

      <h2 className={h2}>1. Information we collect</h2>
      <ul className={ul}>
        <li className={li}>
          <span>
            <strong className="text-gray-900 dark:text-gray-100">Account information</strong> —
            your email address, display name, and password, managed through our authentication
            provider (Supabase Auth).
          </span>
        </li>
        <li className={li}>
          <span>
            <strong className="text-gray-900 dark:text-gray-100">Financial records you create</strong>{" "}
            — invoices, clients, expenses, amounts, currencies, dates, and categories you enter or
            upload.
          </span>
        </li>
        <li className={li}>
          <span>
            <strong className="text-gray-900 dark:text-gray-100">Uploaded documents</strong> —
            receipt and invoice images or PDFs you upload for AI extraction.
          </span>
        </li>
        <li className={li}>
          <span>
            <strong className="text-gray-900 dark:text-gray-100">Preferences</strong> — your
            display currency and notification settings.
          </span>
        </li>
        <li className={li}>
          <span>
            <strong className="text-gray-900 dark:text-gray-100">Technical data</strong> — IP
            address, used only to apply rate limits that keep the service reliable and secure.
          </span>
        </li>
      </ul>

      <h2 className={h2}>2. How we use it</h2>
      <p className={p}>We use your information to:</p>
      <ul className={ul}>
        <li className={li}>Operate your dashboard, invoices, clients, and expenses.</li>
        <li className={li}>
          Run uploaded receipts and invoices through Google&apos;s Gemini API so our AI pipeline
          can extract, validate, and categorize them. Review is always required before anything
          is saved.
        </li>
        <li className={li}>
          Convert amounts between currencies using published reference exchange rates. No personal
          data is sent to the exchange-rate provider.
        </li>
        <li className={li}>
          Send transactional emails (overdue invoice alerts, receipt-processed notices, optional
          weekly summaries) through our email provider, Resend.
        </li>
      </ul>

      <h2 className={h2}>3. Who we share it with</h2>
      <p className={p}>
        We don&apos;t sell your data. We share the minimum necessary with the infrastructure
        providers that run the app:
      </p>
      <ul className={ul}>
        <li className={li}>
          <strong className="text-gray-900 dark:text-gray-100">Supabase</strong> — database,
          authentication, and file storage.
        </li>
        <li className={li}>
          <strong className="text-gray-900 dark:text-gray-100">Google (Gemini API)</strong> —
          processes the content of uploaded receipts/invoices to extract structured data.
        </li>
        <li className={li}>
          <strong className="text-gray-900 dark:text-gray-100">Resend</strong> — delivers the
          transactional emails described above.
        </li>
      </ul>

      <h2 className={h2}>4. Security</h2>
      <p className={p}>
        Every record is scoped to your account with database-level row security, so one user can
        never read another user&apos;s data. All traffic is encrypted in transit, uploads are
        checked for file type and size before processing, and every action is rate-limited to
        prevent abuse.
      </p>

      <h2 className={h2}>5. Data retention and deletion</h2>
      <p className={p}>
        We keep your data for as long as your account is active. Deleting an invoice or expense
        immediately removes its record and any attached receipt file. To close your account and
        delete all associated data, contact us at the address below.
      </p>

      <h2 className={h2}>6. Cookies</h2>
      <p className={p}>
        We use a single authentication cookie to keep you signed in. We don&apos;t use
        advertising or third-party analytics cookies.
      </p>

      <h2 className={h2}>7. Children&apos;s privacy</h2>
      <p className={p}>Invoera is not directed at, and should not be used by, anyone under 16.</p>

      <h2 className={h2}>8. Changes to this policy</h2>
      <p className={p}>
        If this policy changes materially, we&apos;ll update the date above. Continued use of
        Invoera after a change means you accept the updated policy.
      </p>

      <h2 className={h2}>9. Contact</h2>
      <p className={p}>
        Questions about this policy or your data? Email{" "}
        <a href="mailto:support@invoera.app" className="text-teal-600 hover:underline dark:text-teal-400">
          support@invoera.app
        </a>
        .
      </p>

      <p className="mt-10 text-sm text-gray-400 dark:text-gray-500">
        See also our{" "}
        <Link href="/terms" className="text-teal-600 hover:underline dark:text-teal-400">
          Terms of Use
        </Link>
        .
      </p>
    </article>
  );
}
