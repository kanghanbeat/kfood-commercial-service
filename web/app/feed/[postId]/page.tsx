import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import {
  createPostComment,
  getPublishedPostComments,
  getPublishedUserPost,
  removeOwnComment
} from "@kfood/data";

import { ensurePublicProfile, getPublicSession } from "@/lib/public-auth";

export async function generateMetadata({
  params
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const post = await getPublishedUserPost(postId);

  return {
    title: post ? "K-food Record" : "Record"
  };
}

function redirectWithError(postId: string, message: string): never {
  redirect(`/feed/${postId}?error=${encodeURIComponent(message)}`);
}

async function submitComment(formData: FormData) {
  "use server";

  const postId = String(formData.get("post_id") ?? "");
  const session = await getPublicSession();

  if (!session) {
    redirect(`/auth/login?next=${encodeURIComponent(`/feed/${postId}`)}`);
  }

  await ensurePublicProfile(session);

  const result = await createPostComment(session.accessToken, {
    authorId: session.userId,
    body: String(formData.get("body") ?? ""),
    postId
  });

  if (!result.ok) {
    redirectWithError(postId, result.message);
  }

  revalidatePath(`/feed/${postId}`);
  redirect(`/feed/${postId}?commented=1`);
}

async function removeComment(formData: FormData) {
  "use server";

  const postId = String(formData.get("post_id") ?? "");
  const commentId = String(formData.get("comment_id") ?? "");
  const session = await getPublicSession();

  if (!session) {
    redirect(`/auth/login?next=${encodeURIComponent(`/feed/${postId}`)}`);
  }

  const result = await removeOwnComment(session.accessToken, commentId);

  if (!result.ok) {
    redirectWithError(postId, result.message);
  }

  revalidatePath(`/feed/${postId}`);
  redirect(`/feed/${postId}?comment_removed=1`);
}

export default async function FeedPostDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ postId: string }>;
  searchParams?: Promise<{
    commented?: string;
    comment_removed?: string;
    error?: string;
  }>;
}) {
  const { postId } = await params;
  const [post, comments, session, query] = await Promise.all([
    getPublishedUserPost(postId),
    getPublishedPostComments(postId),
    getPublicSession(),
    searchParams
  ]);

  if (!post) {
    notFound();
  }

  return (
    <main className="page-shell">
      <header className="detail-header">
        <p className="eyebrow">User record</p>
        <h1>{post.authorDisplayName ?? "K-food member"}&apos;s record</h1>
        <p className="detail-intro">{post.body}</p>
        <div className="label-row">
          <span className="label-pill preview">User record</span>
          {post.foodId ? <span className="label-pill verified">Food linked</span> : null}
          {post.regionId ? <span className="label-pill">Area linked</span> : null}
          {post.placeId ? <span className="label-pill">Place linked</span> : null}
        </div>
      </header>
      {query?.commented ? (
        <p className="status-message success">Comment added.</p>
      ) : null}
      {query?.comment_removed ? (
        <p className="status-message success">Comment removed.</p>
      ) : null}
      {query?.error ? <p className="status-message error">{query.error}</p> : null}
      <section className="section-block" aria-labelledby="comments">
        <div className="section-heading">
          <p className="eyebrow">Comments</p>
          <h2 id="comments">{comments.length} visible comments</h2>
          <p>
            Comments are user discussion, not verified K-food facts. Report
            stale place or map issues through the report flow.
          </p>
        </div>
        <ul className="content-list">
          {comments.length === 0 ? (
            <li>
              <div className="list-item-body">
                <span className="meta-label">No comments yet</span>
                <strong>Start a focused discussion</strong>
                <p>Keep comments helpful, specific, and connected to the record.</p>
              </div>
            </li>
          ) : null}
          {comments.map((comment) => (
            <li key={comment.id}>
              <div className="list-item-body compact-list-item">
                <span className="meta-label">
                  {comment.authorDisplayName ?? "K-food member"} ·{" "}
                  {new Date(comment.createdAt).toLocaleString("en")}
                </span>
                <p>{comment.body}</p>
                {session?.userId === comment.authorId ? (
                  <form action={removeComment}>
                    <input name="post_id" type="hidden" value={post.id} />
                    <input name="comment_id" type="hidden" value={comment.id} />
                    <button className="button secondary" type="submit">
                      Remove comment
                    </button>
                  </form>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="form-panel" aria-labelledby="comment-form">
        <h2 id="comment-form">Add a comment</h2>
        {session ? (
          <form action={submitComment} className="profile-form">
            <input name="post_id" type="hidden" value={post.id} />
            <label>
              Comment
              <textarea
                maxLength={800}
                minLength={2}
                name="body"
                placeholder="Add a helpful comment about this record."
                required
              />
            </label>
            <button className="button primary" type="submit">
              Post comment
            </button>
          </form>
        ) : (
          <div className="list-item-body">
            <span className="meta-label">Login required</span>
            <strong>Sign in to comment</strong>
            <p>Guests can read public records and comments.</p>
            <Link
              className="button primary"
              href={`/auth/login?next=${encodeURIComponent(`/feed/${post.id}`)}`}
            >
              Log in
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
