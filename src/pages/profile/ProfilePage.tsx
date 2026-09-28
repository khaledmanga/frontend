import { Link } from "@tanstack/react-router";
import { ArrowLeft, Zap } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type {
  ApiComment,
  ApiPost,
  ApiProfileSummary,
} from "@/@types/post";
import {
  createComment,
  createPost,
  deleteComment,
  deletePost,
  getMyProfileSummary,
  getPostsErrorMessage,
  likePost,
  listComments,
  listMyPosts,
  unlikePost,
  updateComment,
  updatePost,
} from "@/apis/post.api";
import { Avatar } from "@/components/posts/Avatar";
import { DeletePostDialog } from "@/components/posts/DeletePostDialog";
import { PostCard } from "@/components/posts/PostCard";
import { PostDialog } from "@/components/posts/PostDialog";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { MESSAGES } from "@/constants/messages";
import { POST_PAGE_SIZE } from "@/constants/pagination";
import { ROUTES } from "@/constants/routes";
import { BUTTON_VARIANTS } from "@/constants/ui";
import { useAuth } from "@/hooks/useAuth";

export function ProfilePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [comments, setComments] = useState<Record<string, ApiComment[]>>({});
  const [commentsLoaded, setCommentsLoaded] = useState<Record<string, boolean>>({});
  const [commentsLoading, setCommentsLoading] = useState<Record<string, boolean>>({});
  const [pendingLikes, setPendingLikes] = useState<Record<string, boolean>>({});
  const [summary, setSummary] = useState<ApiProfileSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [editingPost, setEditingPost] = useState<ApiPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<ApiPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadInitialPosts = useCallback(async () => {
    setLoading(true);
    try {
      const [result, profileSummary] = await Promise.all([
        listMyPosts(1),
        getMyProfileSummary(),
      ]);
      setPosts(result);
      setSummary(profileSummary);
      setComments({});
      setCommentsLoaded({});
      setPage(1);
      setHasMore(result.length === POST_PAGE_SIZE);
      setError(null);
    } catch (requestError) {
      setError(getPostsErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInitialPosts();
  }, [loadInitialPosts]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await listMyPosts(nextPage);
      setPosts((current) => [...current, ...result]);
      setPage(nextPage);
      setHasMore(result.length === POST_PAGE_SIZE);
    } catch (requestError) {
      setError(getPostsErrorMessage(requestError));
    } finally {
      setLoadingMore(false);
    }
  };

  const perform = async (request: () => Promise<void>) => {
    setError(null);
    try {
      await request();
      return true;
    } catch (requestError) {
      setError(getPostsErrorMessage(requestError));
      return false;
    }
  };

  const loadComments = async (postId: string) => {
    if (commentsLoaded[postId] || commentsLoading[postId]) return;
    setCommentsLoading((current) => ({ ...current, [postId]: true }));
    await perform(async () => {
      const result = await listComments(postId);
      setComments((current) => ({ ...current, [postId]: result }));
      setCommentsLoaded((current) => ({ ...current, [postId]: true }));
    });
    setCommentsLoading((current) => ({ ...current, [postId]: false }));
  };

  const handleLike = async (post: ApiPost) => {
    if (pendingLikes[post.id]) return;
    setPendingLikes((current) => ({ ...current, [post.id]: true }));
    await perform(async () => {
      if (post.voted) await unlikePost(post.id);
      else await likePost(post.id);
      setPosts((current) =>
        current.map((item) =>
          item.id === post.id
            ? {
                ...item,
                voted: !post.voted,
                votes: item.votes + (post.voted ? -1 : 1),
              }
            : item,
        ),
      );
      setSummary(await getMyProfileSummary());
    });
    setPendingLikes((current) => ({ ...current, [post.id]: false }));
  };

  const refreshPostComments = async (postId: string) => {
    const result = await listComments(postId);
    setComments((current) => ({ ...current, [postId]: result }));
    setCommentsLoaded((current) => ({ ...current, [postId]: true }));
    setPosts((current) =>
      current.map((post) =>
        post.id === postId ? { ...post, commentCount: result.length } : post,
      ),
    );
    const updatedSummary = await getMyProfileSummary();
    setSummary(updatedSummary);
  };

  const handleCreateComment = (postId: string, body: string, parentId?: string | null) =>
    perform(async () => {
      await createComment(postId, body, parentId ?? null);
      await refreshPostComments(postId);
    });

  const handleUpdateComment = (postId: string, commentId: string, body: string) =>
    perform(async () => {
      await updateComment(commentId, body);
      await refreshPostComments(postId);
    });

  const handleDeleteComment = (postId: string, commentId: string) =>
    perform(async () => {
      await deleteComment(commentId);
      await refreshPostComments(postId);
    });

  const submitProfilePost = async (title: string, body: string) => {
    setSaving(true);
    const succeeded = await perform(async () => {
      const input = { title, body, tags: [] };
      if (editingPost) await updatePost(editingPost.id, input);
      else await createPost(input);
      const [updatedPosts, updatedSummary] = await Promise.all([
        listMyPosts(1),
        getMyProfileSummary(),
      ]);
      setPosts(updatedPosts);
      setSummary(updatedSummary);
      setPage(1);
      setHasMore(updatedPosts.length === POST_PAGE_SIZE);
      setEditingPost(null);
    });
    setSaving(false);
    return succeeded;
  };

  const confirmDeletePost = async () => {
    if (!deletingPost) return;
    setDeleting(true);
    await perform(async () => {
      await deletePost(deletingPost.id);
      const [updatedPosts, updatedSummary] = await Promise.all([
        listMyPosts(1),
        getMyProfileSummary(),
      ]);
      setPosts(updatedPosts);
      setSummary(updatedSummary);
      setPage(1);
      setHasMore(updatedPosts.length === POST_PAGE_SIZE);
      setComments((current) => {
        const next = { ...current };
        delete next[deletingPost.id];
        return next;
      });
      setDeletingPost(null);
    });
    setDeleting(false);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to={ROUTES.HOME} className="brand" aria-label={MESSAGES.loopHome}>
          <span className="brand-mark">
            <Zap size={18} fill="currentColor" />
          </span>
          <span>loop</span>
        </Link>
        <div className="top-actions">
          <Avatar name={user?.name ?? MESSAGES.user} />
        </div>
      </header>
      <main className="main-content">
        <section className="profile-screen">
          <Link to={ROUTES.HOME} className="profile-back-link">
            <ArrowLeft size={16} />
            {MESSAGES.backToPosts}
          </Link>
          <div className="profile-header">
            <Avatar name={user?.name ?? MESSAGES.user} />
            <div>
              <span className="eyebrow">{MESSAGES.yourProfile}</span>
              <h1>{user?.name ?? MESSAGES.myProfileHeading}</h1>
            </div>
          </div>
          <div className="profile-stats" aria-label={MESSAGES.profileStatistics}>
            <div className="profile-post-count">
              <strong>{summary?.postCount ?? MESSAGES.noValue}</strong>
              <span>{MESSAGES.posts}</span>
            </div>
            <div className="profile-engagement-totals">
              <span aria-label={MESSAGES.postsReceivedLabel(summary?.likeCount ?? 0)}>
                {summary?.likeCount ?? MESSAGES.noValue}
                <span>{MESSAGES.likes}</span>
              </span>
              <span aria-label={MESSAGES.commentsCountLabel(summary?.commentCount ?? 0)}>
                {summary?.commentCount ?? MESSAGES.noValue}
                <span>{MESSAGES.comments}</span>
              </span>
            </div>
          </div>
          <div className="profile-posts-heading">
            <h2>{MESSAGES.yourPosts}</h2>
          </div>
          {error && (
            <Alert unstyled className="feed-error">
              {error}
              <Button variant={BUTTON_VARIANTS.Unstyled} type="button" onClick={() => void loadInitialPosts()}>
                {MESSAGES.tryAgain}
              </Button>
            </Alert>
          )}
          {loading ? (
            <p className="feed-status" role="status">{MESSAGES.loadingYourPosts}</p>
          ) : posts.length === 0 ? (
            <section className="empty-state">
              <h2>{MESSAGES.noPostsYet}</h2>
              <p>{MESSAGES.profileEmptyPosts}</p>
            </section>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                userId={user?.id}
                comments={comments[post.id] ?? []}
                commentsLoading={commentsLoading[post.id] ?? false}
                likePending={pendingLikes[post.id] ?? false}
                onLike={() => void handleLike(post)}
                onLoadComments={() => void loadComments(post.id)}
                onAddComment={(body, parentId) =>
                  handleCreateComment(post.id, body, parentId)
                }
                onUpdateComment={(id, body) =>
                  handleUpdateComment(post.id, id, body)
                }
                onDeleteComment={(id) => handleDeleteComment(post.id, id)}
                onEdit={() => setEditingPost(post)}
                onDelete={() => setDeletingPost(post)}
              />
            ))
          )}
          {!loading && hasMore && (
            <Button
              variant={BUTTON_VARIANTS.Unstyled}
              type="button"
              className="secondary-button"
              disabled={loadingMore}
              onClick={() => void loadMore()}
            >
              {loadingMore ? MESSAGES.loading : MESSAGES.loadMore}
            </Button>
          )}
        </section>
      </main>
      {editingPost && (
        <PostDialog
          post={editingPost ?? undefined}
          saving={saving}
          onClose={() => setEditingPost(null)}
          onSave={submitProfilePost}
        />
      )}
      {deletingPost && (
        <DeletePostDialog
          post={deletingPost}
          deleting={deleting}
          onCancel={() => setDeletingPost(null)}
          onConfirm={() => void confirmDeletePost()}
        />
      )}
    </div>
  );
}
