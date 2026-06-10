import { redirect } from "next/navigation";

import { submitContentReport } from "@kfood/data";

export const metadata = {
  title: "Report Content"
};

async function submitReport(formData: FormData) {
  "use server";

  const result = await submitContentReport({
    pageUrl: String(formData.get("page_url") ?? ""),
    reportType: String(formData.get("report_type") ?? ""),
    message: String(formData.get("message") ?? ""),
    userEmail: String(formData.get("user_email") ?? ""),
    honeypot: String(formData.get("website") ?? "")
  });

  if (!result.ok) {
    redirect(`/report?error=${encodeURIComponent(result.message)}`);
  }

  redirect("/report?submitted=1");
}

export default async function ReportPage({
  searchParams
}: {
  searchParams?: Promise<{ submitted?: string; error?: string }>;
}) {
  const params = await searchParams;
  const submitted = params?.submitted === "1";
  const error = params?.error;

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Report</p>
        <h1>Report stale or incorrect information</h1>
        <p className="detail-intro">
          Send map, closure, disclosure, or stale-content issues directly into
          the service review queue.
        </p>
      </header>

      {submitted ? (
        <p className="status-message success">
          Thanks. Your report was received and queued for review.
        </p>
      ) : null}
      {error ? <p className="status-message error">{error}</p> : null}

      <form
        action={submitReport}
        className="form-panel"
        aria-label="Content report form"
      >
        <label>
          Page URL
          <input
            name="page_url"
            placeholder="https://kfood.example.com/places/..."
            required
            type="url"
          />
        </label>
        <label>
          Issue type
          <select defaultValue="incorrect_info" name="report_type" required>
            <option value="incorrect_info">Incorrect information</option>
            <option value="closed_place">Closed place</option>
            <option value="map_issue">Map issue</option>
            <option value="sponsorship_disclosure">Disclosure issue</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Details
          <textarea
            maxLength={2000}
            name="message"
            placeholder="What should be corrected?"
            required
          />
        </label>
        <label>
          Email for follow-up, optional
          <input
            name="user_email"
            placeholder="you@example.com"
            type="email"
          />
        </label>
        <label className="trap-field" aria-hidden="true">
          Website
          <input
            autoComplete="off"
            name="website"
            tabIndex={-1}
            type="text"
          />
        </label>
        <button className="button primary" type="submit">
          Submit report
        </button>
      </form>
    </main>
  );
}
