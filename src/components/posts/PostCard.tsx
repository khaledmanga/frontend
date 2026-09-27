import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import type { ApiComment, ApiPost } from "@/api/postsApi";
import { Avatar } from "./Avatar";

type PostCardProps = {
  post: ApiPost;
  userId: string | undefined;
  comments: ApiComment[];
  commentsLoading: boolean;
  likePending: boolean;
  onLike: () => void;
  onLoadComments: () => void;
  onAddComment: (body: string, parentId?: string | null) => Promise<boolean>;
  onUpdateComment: (id: string, body: string) => Promise<boolean>;
  onDeleteComment: (id: string) => Promise<boolean>;
  onEdit: () => void;
  onDelete: () => void;
};

function formatPostDate(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
}

export function PostCard({
  post,
  userId,
  comments,
  commentsLoading,
  likePending,
  onLike,
  onLoadComments,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onEdit,
  onDelete,
}: PostCardProps) {
  const [comment, setComment] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentDrafts, setCommentDrafts] = useState<
    Record<string, string>
  >({});
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [pendingComment, setPendingComment] = useState(false);
  const canManage = Boolean(userId && userId === post.author.id);

  const renderComment = (item: ApiComment, depth = 0) => {
    const childComments = comments.filter(
      (candidate) => candidate.parentId === item.id,
    );
    const canManageComment = userId !== undefined && userId === item.author.id;

    return (
      <div
        key={item.id}
        className="comment-thread"
        style={{ marginLeft: depth > 0 ? 16 : 0 }}
      >
        <div className="comment-row">
          <Avatar name={item.author.name} />
          <div className="comment-content">
            {editingComment === item.id ? (
              <form
                className="comment-form comment-inline-form comment-edit-form"
                onSubmit={(event) => void submitCommentEdit(event, item.id)}
              >
                <input
                  value={commentDrafts[item.id] ?? item.body}
                  maxLength={5000}
                  onChange={(event) =>
                    setCommentDrafts((current) => ({
                      ...current,
                      [item.id]: event.target.value,
                    }))
                  }
                  aria-label="Edit comment"
                />
                <div className="reply-actions">
                  <button type="submit" disabled={pendingComment}>
                    Save
                  </button>
                  <button type="button" onClick={() => setEditingComment(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p>
                <strong>{item.author.name}</strong> {item.body}
              </p>
            )}
            <div className="comment-meta">
              {userId && (
                <button
                  type="button"
                  onClick={() => {
                    setReplyingTo((current) =>
                      current === item.id ? null : item.id,
                    );
                  }}
                >
                  Reply
                </button>
              )}
              {canManageComment && editingComment !== item.id && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setCommentDrafts((current) => ({
                        ...current,
                        [item.id]: item.body,
                      }));
                      setEditingComment(item.id);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={pendingComment}
                    onClick={() => void removeComment(item.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
            {replyingTo === item.id && userId && (
              <form
                className="comment-form comment-inline-form nested-comment-form"
                onSubmit={(event) => void submitReply(event, item.id)}
              >
                <input
                  value={replyDrafts[item.id] ?? ""}
                  maxLength={5000}
                  onChange={(event) =>
                    setReplyDrafts((current) => ({
                      ...current,
                      [item.id]: event.target.value,
                    }))
                  }
                  placeholder={`Reply to ${item.author.name}...`}
                  aria-label={`Reply to ${item.author.name}`}
                />
                <div className="reply-actions">
                  <button
                    type="submit"
                    disabled={!replyDrafts[item.id]?.trim() || pendingComment}
                  >
                    Send
                  </button>
                  <button type="button" onClick={() => setReplyingTo(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        {childComments.length > 0 && (
          <div className="comment-replies">
            {childComments.map((child) => renderComment(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const toggleComments = () => {
    const opening = !commentsOpen;
    setCommentsOpen(opening);
    if (opening) onLoadComments();
  };

  const submitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = comment.trim();
    if (!body || pendingComment) return;
    setPendingComment(true);
    try {
      if (await onAddComment(body)) setComment("");
    } finally {
      setPendingComment(false);
    }
  };

  const submitReply = async (
    event: FormEvent<HTMLFormElement>,
    parentId: string,
  ) => {
    event.preventDefault();
    const body = replyDrafts[parentId]?.trim();
    if (!body || pendingComment) return;
    setPendingComment(true);
    try {
      if (await onAddComment(body, parentId)) {
        setReplyDrafts((current) => ({ ...current, [parentId]: "" }));
        setReplyingTo(null);
      }
    } finally {
      setPendingComment(false);
    }
  };

  const submitCommentEdit = async (
    event: FormEvent<HTMLFormElement>,
    id: string,
  ) => {
    event.preventDefault();
    const body = commentDrafts[id]?.trim();
    if (!body || pendingComment) return;
    setPendingComment(true);
    try {
      if (await onUpdateComment(id, body)) setEditingComment(null);
    } finally {
      setPendingComment(false);
    }
  };

  const removeComment = async (id: string) => {
    if (pendingComment) return;
    setPendingComment(true);
    try {
      await onDeleteComment(id);
    } finally {
      setPendingComment(false);
    }
  };

  return (
    <article className="post-card">
      <div className="post-heading">
        <div className="post-person">
          <Avatar name={post.author.name} />
          <span>
            <strong>{post.author.name}</strong>
            <small>{formatPostDate(post.createdAt)}</small>
          </span>
        </div>
        {canManage && (
          <div className="post-menu-wrap">
            <button
              type="button"
              className="icon-button"
              aria-label="Post options"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <MoreHorizontal size={21} />
            </button>
            {menuOpen && (
              <div className="post-menu" role="menu">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit();
                  }}
                >
                  <Pencil size={15} />
                  Edit post
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="delete-menu-item"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete();
                  }}
                >
                  <Trash2 size={15} />
                  Delete post
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {post.title && <h2 className="post-title">{post.title}</h2>}
      <div className="post-caption">
        <p>{post.body}</p>
        {post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        )}
      </div>
      <div className="post-actions">
        <div className="post-action-group">
          <button
            type="button"
            className={`icon-button${post.voted ? " liked" : ""}`}
            aria-label={post.voted ? "Unlike post" : "Like post"}
            onClick={onLike}
            disabled={likePending}
          >
            <Heart size={21} fill={post.voted ? "currentColor" : "none"} />
            <span>{post.votes}</span>
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label="Show comments"
            aria-expanded={commentsOpen}
            onClick={toggleComments}
          >
            <MessageCircle size={20} />
            <span>{post.commentCount}</span>
          </button>
        </div>
      </div>
      {commentsOpen && (
        <section
          className="comments-panel"
          aria-label={`Comments on ${post.title || "post"}`}
        >
          {commentsLoading ? (
            <p>Loading comments...</p>
          ) : (
            comments
              .filter((item) => item.parentId === null)
              .map((item) => renderComment(item))
          )}
          {userId ? (
            <form
              className="comment-form root-comment-form"
              onSubmit={submitComment}
            >
              <input
                value={comment}
                maxLength={5000}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Add a comment..."
                aria-label="Write a comment"
              />
              <button
                type="submit"
                aria-label="Send comment"
                disabled={!comment.trim() || pendingComment}
              >
                <ArrowUpRight size={18} />
              </button>
            </form>
          ) : (
            <p className="comments-link">
              <Link to="/login">Log in to comment</Link>
            </p>
          )}
        </section>
      )}
    </article>
  );
}
