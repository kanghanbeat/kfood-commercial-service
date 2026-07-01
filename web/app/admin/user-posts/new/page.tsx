import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createAdminUserPost,
  getPublishedFoods,
  getPublishedPlaces,
  getPublishedRegions,
  getPublishedRoutes,
  type SupportedLanguage,
  type UserPostStatus,
  type UserPostVisibility
} from "@kfood/data";

import { AdminNav } from "@/components/admin-nav";
import { requireAdminSession } from "@/lib/admin-auth";

export const metadata = {
  robots: {
    follow: false,
    index: false
  },
  title: "New Admin User Post"
};

const languageOptions: Array<{ label: string; value: SupportedLanguage }> = [
  { label: "English", value: "en" },
  { label: "한국어", value: "ko" },
  { label: "日本語", value: "ja" },
  { label: "中文", value: "zh" }
];

const visibilityOptions: Array<{ label: string; value: UserPostVisibility }> = [
  { label: "Public", value: "public" },
  { label: "Unlisted", value: "unlisted" },
  { label: "Private", value: "private" }
];

const statusOptions: Array<{
  label: string;
  value: Extract<UserPostStatus, "pending_review" | "published">;
}> = [
  { label: "Publish now", value: "published" },
  { label: "Save for review", value: "pending_review" }
];

const languageValues = languageOptions.map((option) => option.value);
const visibilityValues = visibilityOptions.map((option) => option.value);
const statusValues = statusOptions.map((option) => option.value);

function redirectWithError(message: string): never {
  redirect(`/admin/user-posts/new?error=${encodeURIComponent(message)}`);
}

async function submitAdminPost(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const language = String(formData.get("language") ?? "en") as SupportedLanguage;
  const visibility = String(
    formData.get("visibility") ?? "public"
  ) as UserPostVisibility;
  const status = String(formData.get("status") ?? "published") as Extract<
    UserPostStatus,
    "pending_review" | "published"
  >;

  if (!languageValues.includes(language)) {
    redirectWithError("Choose a supported language.");
  }

  if (!visibilityValues.includes(visibility)) {
    redirectWithError("Choose a supported visibility.");
  }

  if (!statusValues.includes(status)) {
    redirectWithError("Choose a supported post status.");
  }

  const result = await createAdminUserPost(session.accessToken, {
    actorId: session.userId,
    authorId: session.userId,
    body: String(formData.get("body") ?? ""),
    foodSlug: String(formData.get("food_slug") ?? "") || null,
    language,
    moderationNote: String(formData.get("moderation_note") ?? ""),
    placeSlug: String(formData.get("place_slug") ?? "") || null,
    regionSlug: String(formData.get("region_slug") ?? "") || null,
    routeSlug: String(formData.get("route_slug") ?? "") || null,
    status,
    visibility
  });

  if (!result.ok) {
    redirectWithError(result.message);
  }

  revalidatePath("/feed");
  revalidatePath("/admin/user-posts");
  redirect("/admin/user-posts?created=1");
}

export default async function NewAdminUserPostPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const [session, params, foods, places, regions, routes] = await Promise.all([
    requireAdminSession(),
    searchParams,
    getPublishedFoods(),
    getPublishedPlaces(),
    getPublishedRegions(),
    getPublishedRoutes()
  ]);

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Admin</p>
        <h1>Create a community record.</h1>
        <p className="detail-intro">
          Write an editorially controlled record using your admin account. Use
          this for alpha seed posts while public social login remains closed.
        </p>
      </header>
      <AdminNav />
      {params?.error ? (
        <p className="status-message error">{params.error}</p>
      ) : null}
      <form action={submitAdminPost} className="form-panel">
        <input name="author_id" type="hidden" value={session.userId} />
        <label>
          Record text
          <textarea
            maxLength={2000}
            minLength={10}
            name="body"
            placeholder="Write a verified K-food note, route tip, or place context for alpha users."
            required
          />
        </label>
        <label>
          Language
          <select defaultValue="en" name="language">
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Visibility
          <select defaultValue="public" name="visibility">
            {visibilityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select defaultValue="published" name="status">
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Linked food
          <select defaultValue="" name="food_slug">
            <option value="">No food selected</option>
            {foods.map((food) => (
              <option key={food.slug} value={food.slug}>
                {food.nameEn}
              </option>
            ))}
          </select>
        </label>
        <label>
          Linked area
          <select defaultValue="" name="region_slug">
            <option value="">No area selected</option>
            {regions.map((region) => (
              <option key={region.slug} value={region.slug}>
                {region.nameEn}
              </option>
            ))}
          </select>
        </label>
        <label>
          Linked place
          <select defaultValue="" name="place_slug">
            <option value="">No place selected</option>
            {places.map((place) => (
              <option key={place.slug} value={place.slug}>
                {place.nameEn}
              </option>
            ))}
          </select>
        </label>
        <label>
          Linked route
          <select defaultValue="" name="route_slug">
            <option value="">No route selected</option>
            {routes.map((route) => (
              <option key={route.slug} value={route.slug}>
                {route.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Moderation note
          <textarea
            maxLength={1000}
            name="moderation_note"
            placeholder="What did you verify before publishing?"
          />
        </label>
        <button className="button primary" type="submit">
          Create record
        </button>
      </form>
    </main>
  );
}
