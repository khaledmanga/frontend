import { Link } from "@tanstack/react-router";
import { Plus, Zap } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { ApiComment, ApiPost } from "@/@types/post";
import {
  createComment,
  createPost,
  deleteComment,
  deletePost,
  getPostsErrorMessage,
  likePost,
  listComments,
  listPosts,
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

export function HomePage() {
  const { user, logout, loading: authLoading, error: authError } = useAuth();
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [comments, setComments] = useState<Record<string, ApiComment[]>>({});
  const [commentsLoaded, setCommentsLoaded] = useState<Record<string, boolean>>({});
  const [commentsLoading, setCommentsLoading] = useState<Record<string, boolean>>({});
  const [pendingLikes, setPendingLikes] = useState<Record<string, boolean>>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<ApiPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<ApiPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshPosts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listPosts(1);
      setPosts(result);
      setPage(1);
      setHasMore(result.length === POST_PAGE_SIZE);
      setError(null);
    } catch (requestError) {
      setError(getPostsErrorMessage(requestError));
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setPosts([]);
      setComments({});
      setCommentsLoaded({});
      setPage(1);
      setHasMore(false);
      setLoading(false);
      setError(null);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);
    setPosts([]);
    setComments({});
    setCommentsLoaded({});
    void listPosts(1)
      .then((result) => {
        if (active) {
          setPosts(result);
          setHasMore(result.length === POST_PAGE_SIZE);
        }
      })
      .catch((requestError: unknown) => {
        if (active) setError(getPostsErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await listPosts(nextPage);
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
    const succeeded = await perform(async () => {
      const result = await listComments(postId);
      setComments((current) => ({ ...current, [postId]: result }));
      setCommentsLoaded((current) => ({ ...current, [postId]: true }));
    });
    if (!succeeded) setCommentsLoaded((current) => ({ ...current, [postId]: false }));
    setCommentsLoading((current) => ({ ...current, [postId]: false }));
  };

  const submitPost = async (title: string, body: string) => {
    setSaving(true);
    const succeeded = await perform(async () => {
      const input = { title, body, tags: [] };
      if (editingPost) await updatePost(editingPost.id, input);
      else await createPost(input);
      await refreshPosts();
    });
    setSaving(false);
    return succeeded;
  };

  const confirmDeletePost = async () => {
    if (!deletingPost) return;
    setDeleting(true);
    const succeeded = await perform(async () => {
      await deletePost(deletingPost.id);
      setPosts((current) => current.filter((post) => post.id !== deletingPost.id));
      setComments((current) => {
        const next = { ...current };
        delete next[deletingPost.id];
        return next;
      });
      setDeletingPost(null);
    });
    setDeleting(false);
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
    });
    setPendingLikes((current) => ({ ...current, [post.id]: false }));
  };

  const handleCreateComment = (postId: string, body: string, parentId?: string | null) =>
    perform(async () => {
      await createComment(postId, body, parentId ?? null);
      const result = await listComments(postId);
      setComments((current) => ({ ...current, [postId]: result }));
      setCommentsLoaded((current) => ({ ...current, [postId]: true }));
      setPosts((current) =>
        current.map((post) =>
          post.id === postId
            ? { ...post, commentCount: result.length }
            : post,
        ),
      );
    });

  const handleUpdateComment = (postId: string, commentId: string, body: string) =>
    perform(async () => {
      await updateComment(commentId, body);
      const result = await listComments(postId);
      setComments((current) => ({ ...current, [postId]: result }));
    });

  const handleDeleteComment = (postId: string, commentId: string) =>
    perform(async () => {
      await deleteComment(commentId);
      const result = await listComments(postId);
      setComments((current) => ({ ...current, [postId]: result }));
      setPosts((current) =>
        current.map((post) =>
          post.id === postId
            ? { ...post, commentCount: result.length }
            : post,
        ),
      );
    });

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
          {user ? (
            <>
              <Button
                variant={BUTTON_VARIANTS.Unstyled}
                type="button"
                className="auth-nav-join create-post-button"
                aria-label={MESSAGES.createPost}
                title={MESSAGES.createPost}
                onClick={() => {
                  setEditingPost(null);
                  setCreateOpen(true);
                }}
              >
                <Plus size={17} />
              </Button>
              <div className="user-menu-wrap">
                <Button
                  variant={BUTTON_VARIANTS.Unstyled}
                  type="button"
                  className="top-profile"
                  aria-label={MESSAGES.userMenu}
                  aria-expanded={userMenuOpen}
                  onClick={() => setUserMenuOpen((open) => !open)}
                >
                  <Avatar name={user.name} />
                </Button>
                {userMenuOpen && (
                  <div className="user-dropdown" role="menu">
                    <div className="user-dropdown-name">{user.name}</div>
                    <Link
                      to={ROUTES.PROFILE}
                      className="user-dropdown-action"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {MESSAGES.myProfile}
                    </Link>
                    <Button
                      variant={BUTTON_VARIANTS.Unstyled}
                      type="button"
                      className="user-dropdown-action"
                      disabled={authLoading}
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                    >
                      {MESSAGES.logout}
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} className="auth-nav-link">
                {MESSAGES.login}
              </Link>
              <Link to={ROUTES.REGISTER} className="auth-nav-join">
                {MESSAGES.authCreateAccount}
              </Link>
            </>
          )}
        </div>
      </header>
      <main className="main-content">
        <div className="feed-layout feed-only-layout">
          <section className="feed-column">
            <div className="feed-heading">
              <div>
                <span className="eyebrow">{MESSAGES.loopCommunity}</span>
                <h1>{MESSAGES.posts}</h1>
              </div>
            </div>
            {error && (
              <Alert unstyled className="feed-error">
                {error}
                {user && (
                  <Button
                    variant={BUTTON_VARIANTS.Unstyled}
                    type="button"
                    onClick={() =>
                      void refreshPosts().catch((requestError: unknown) =>
                        setError(getPostsErrorMessage(requestError)),
                      )
                    }
                  >
                    {MESSAGES.tryAgain}
                  </Button>
                )}
              </Alert>
            )}
            {authError && (
              <Alert unstyled className="feed-error">
                {authError}
              </Alert>
            )}
            {loading ? (
              <p className="feed-status" role="status">
                {MESSAGES.loadingPosts}
              </p>
            ) : error ? null : posts.length === 0 ? (
              <section className="empty-state">
                <h2>{MESSAGES.noPostsYet}</h2>
                <p>{MESSAGES.firstCommunityPost}</p>
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
                  onEdit={() => {
                    setEditingPost(post);
                    setCreateOpen(false);
                  }}
                  onDelete={() => setDeletingPost(post)}
                />
              ))
            )}
            {!loading && !error && hasMore && (
              <Button
                variant={BUTTON_VARIANTS.Unstyled}
                type="button"
                className="secondary-button"
                disabled={loadingMore}
                onClick={() => void loadMorePosts()}
              >
                {loadingMore ? MESSAGES.loading : MESSAGES.loadMore}
              </Button>
            )}
          </section>
        </div>
      </main>
      {(createOpen || editingPost) && (
        <PostDialog
          post={editingPost ?? undefined}
          saving={saving}
          onClose={() => {
            setCreateOpen(false);
            setEditingPost(null);
          }}
          onSave={submitPost}
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
