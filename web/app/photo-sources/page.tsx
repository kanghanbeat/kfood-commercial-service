import Link from "next/link";

import {
  getFoodPhotoReviewNote,
  getFoodPhotoSourceCandidates,
  getPublishedFoods
} from "@kfood/data";

export const metadata = {
  title: "Food Photo Sources"
};

export default async function PhotoSourcesPage() {
  const foods = await getPublishedFoods();

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">Photo sources</p>
        <h1>Copyright-safe photo review board</h1>
        <p className="detail-intro">
          Review candidate image sources for the 30 published food pages before
          storing or displaying photos. This page does not approve images by
          itself; it makes the license-check workflow visible.
        </p>
      </header>

      <section className="section-block" aria-labelledby="photo-rules">
        <div className="section-heading">
          <p className="eyebrow">Use rules</p>
          <h2 id="photo-rules">What counts as safe enough for alpha</h2>
        </div>
        <ul className="content-list">
          <li>
            <div className="list-item-body">
              <span className="meta-label">Prefer</span>
              <strong>Public domain, CC BY, or CC BY-SA</strong>
              <p>
                These are the safest starting points for a service that may
                later monetize, as long as attribution and license terms are
                followed.
              </p>
            </div>
          </li>
          <li>
            <div className="list-item-body">
              <span className="meta-label">Avoid</span>
              <strong>NonCommercial, NoDerivatives, fair use, and blogs</strong>
              <p>
                Do not use photos that block commercial use, block derivative
                use, rely on fair use, or appear only in restaurant blogs,
                menus, delivery apps, or news articles without clear permission.
              </p>
            </div>
          </li>
          <li>
            <div className="list-item-body">
              <span className="meta-label">Record</span>
              <strong>Title, author, source, license, and review date</strong>
              <p>
                Before a photo becomes visible on public pages, store the
                attribution details and keep a source link that can be audited.
              </p>
            </div>
          </li>
        </ul>
      </section>

      <section className="section-block" aria-labelledby="food-photo-list">
        <div className="section-heading">
          <p className="eyebrow">30 foods</p>
          <h2 id="food-photo-list">Review links by food</h2>
        </div>
        <ul className="content-list">
          {foods.map((food, index) => {
            const review = getFoodPhotoReviewNote(food);
            return (
            <li className={`review-${review.state}`} key={food.slug}>
              <div className="list-item-body">
                <span className="meta-label">
                  #{index + 1} · Spicy level {food.spicyLevel}/4
                </span>
                <strong>{food.nameEn}</strong>
                <p>{food.summary}</p>
                <div className="review-note">
                  <span>{review.label}</span>
                  <p>{review.note}</p>
                  <small>{review.nextAction}</small>
                </div>
                <div className="source-grid">
                  {getFoodPhotoSourceCandidates(food).map((candidate) => (
                    <a
                      className="source-link"
                      href={candidate.href}
                      key={candidate.sourceName}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span>{candidate.sourceName}</span>
                      <strong>{candidate.licenseFit}</strong>
                      <small>{candidate.reviewNote}</small>
                    </a>
                  ))}
                </div>
                <Link className="inline-link" href={`/foods/${food.slug}`}>
                  Open food page
                </Link>
              </div>
            </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
