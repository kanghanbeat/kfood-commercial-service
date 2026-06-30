import { redirect } from "next/navigation";

import {
  createUserPost,
  getPublishedFoods,
  getPublishedPlaces,
  getPublishedRegions,
  getPublishedRoutes,
  type SupportedLanguage,
  type UserPostVisibility
} from "@kfood/data";

import { ensurePublicProfile, requirePublicSession } from "@/lib/public-auth";

export const metadata = {
  robots: {
    follow: false,
    index: false
  },
  title: "Write Record"
};

const languageOptions: Array<{ label: string; value: SupportedLanguage }> = [
  { label: "English", value: "en" },
  { label: "한국어", value: "ko" },
  { label: "日本語", value: "ja" },
  { label: "中文", value: "zh" }
];

const visibilityOptions: Array<{ label: string; value: UserPostVisibility }> = [
  { label: "Public after review", value: "public" },
  { label: "Private draft", value: "private" },
  { label: "Unlisted", value: "unlisted" }
];

const languageValues = languageOptions.map((option) => option.value);
const visibilityValues = visibilityOptions.map((option) => option.value);

function redirectWithError(message: string): never {
  redirect(`/feed/new?error=${encodeURIComponent(message)}`);
}

async function submitPost(formData: FormData) {
  "use server";

  const session = await requirePublicSession("/feed/new");
  await ensurePublicProfile(session);

  const language = String(formData.get("language") ?? "en") as SupportedLanguage;
  const visibility = String(
    formData.get("visibility") ?? "public"
  ) as UserPostVisibility;

  if (!languageValues.includes(language)) {
    redirectWithError("Choose a supported language.");
  }

  if (!visibilityValues.includes(visibility)) {
    redirectWithError("Choose a supported visibility.");
  }

  const result = await createUserPost(session.accessToken, {
    authorId: session.userId,
    body: String(formData.get("body") ?? ""),
    foodSlug: String(formData.get("food_slug") ?? "") || null,
    language,
    placeSlug: String(formData.get("place_slug") ?? "") || null,
    regionSlug: String(formData.get("region_slug") ?? "") || null,
    routeSlug: String(formData.get("route_slug") ?? "") || null,
    visibility
  });

  if (!result.ok) {
    redirectWithError(result.message);
  }

  redirect("/mypage?updated=1");
}

export default async function NewFeedRecordPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const [session, params, foods, places, regions, routes] = await Promise.all([
    requirePublicSession("/feed/new"),
    searchParams,
    getPublishedFoods(),
    getPublishedPlaces(),
    getPublishedRegions(),
    getPublishedRoutes()
  ]);

  await ensurePublicProfile(session);

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Write record</p>
        <h1>Add a K-food record.</h1>
        <p className="detail-intro">
          Share a short experience and connect it to trusted K-food data. Public
          records enter review before appearing in Feed.
        </p>
      </header>
      {params?.error ? (
        <p className="status-message error">{params.error}</p>
      ) : null}
      <form action={submitPost} className="form-panel">
        <label>
          Record text
          <textarea
            maxLength={2000}
            minLength={10}
            name="body"
            placeholder="What did you try, where, and what should another traveler know?"
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
        <button className="button primary" type="submit">
          Submit for review
        </button>
      </form>
    </main>
  );
}
