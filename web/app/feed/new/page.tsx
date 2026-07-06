import {
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
      <form action="/feed/new/submit" className="form-panel" method="post">
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
