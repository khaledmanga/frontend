import axios from "axios";
import { apiHttp } from "./http";

export type PostAuthor = { id: string | null; name: string };
export type ApiPost = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  author: PostAuthor;
  createdAt: string | null;
  votes: number;
  voted: boolean;
  commentCount: number;
};
export type ApiComment = {
  id: string;
  parentId: string | null;
  body: string;
  author: PostAuthor;
  createdAt: string | null;
};
export type ApiProfileSummary = {
  postCount: number;
  likeCount: number;
  commentCount: number;
};
export type PostInput = { title: string; body: string; tags: string[] };
export const POST_PAGE_SIZE = 20;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getString(
  record: Record<string, unknown>,
  ...keys: string[]
): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
  }
  return null;
}

function getNumber(
  record: Record<string, unknown>,
  ...keys: string[]
): number {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
      return Number(value);
    }
  }
  return 0;
}

function getAuthor(value: unknown, record: Record<string, unknown>): PostAuthor {
  const author = isRecord(value) ? value : {};
  const id =
    getString(author, "id", "ID", "userId", "user_id", "UserID") ??
    getString(record, "authorId", "author_id", "userId", "user_id", "UserID");
  const name =
    getString(author, "name", "Name", "username", "Username", "email", "Email") ??
    getString(record, "authorName", "author_name", "AuthorName", "username") ??
    "Unknown user";
  return { id, name };
}

function unwrapList(data: unknown, keys: string[], depth = 0): unknown[] {
  if (Array.isArray(data)) return data;
  if (!isRecord(data) || depth > 2) {
    throw new Error("The server returned an invalid list response.");
  }
  for (const key of keys) {
    const value = Object.entries(data).find(
      ([field]) => field.toLowerCase() === key.toLowerCase(),
    )?.[1];
    if (Array.isArray(value)) return value;
  }
  const nested = Object.entries(data).find(([field]) =>
    ["data", "result", "payload"].includes(field.toLowerCase()),
  )?.[1];
  if (nested !== undefined) return unwrapList(nested, keys, depth + 1);
  throw new Error("The server returned an invalid list response.");
}

export function normalizePost(value: unknown): ApiPost {
  if (!isRecord(value)) {
    throw new Error("The server returned an invalid post.");
  }
  const id = getString(value, "id", "ID", "postId", "post_id", "PostID");
  const body = getString(value, "body", "Body", "content", "Content", "caption", "text");
  if (!id || body === null) {
    throw new Error("The server returned a post without an ID or body.");
  }
  const rawTags = value.tags ?? value.Tags;
  return {
    id,
    title: getString(value, "title", "Title") ?? "",
    body,
    tags: Array.isArray(rawTags)
      ? rawTags.filter((tag): tag is string => typeof tag === "string")
      : [],
    author: getAuthor(value.author ?? value.Author ?? value.user ?? value.User, value),
    createdAt: getString(value, "createdAt", "created_at", "CreatedAt"),
    votes: getNumber(
      value,
      "votes",
      "Votes",
      "likes",
      "Likes",
      "likeCount",
      "like_count",
      "LikesCount",
      "LikeCount",
    ),
    voted:
      value.voted === true ||
      value.Voted === true ||
      value.liked === true ||
      value.isLiked === true ||
      value.is_liked === true ||
      value.IsLiked === true ||
      value.IsVoted === true,
    commentCount: getNumber(
      value,
      "commentCount",
      "comment_count",
      "CommentCount",
      "CommentsCount",
      "commentsCount",
      "comments_count",
    ),
  };
}

export function normalizeComment(value: unknown): ApiComment {
  if (!isRecord(value)) {
    throw new Error("The server returned an invalid comment.");
  }
  const id = getString(value, "id", "ID", "commentId", "comment_id", "CommentID");
  const body = getString(value, "body", "Body", "content", "Content", "text");
  if (!id || body === null) {
    throw new Error("The server returned a comment without an ID or body.");
  }
  return {
    id,
    parentId: getString(value, "parentId", "parent_id", "ParentID"),
    body,
    author: getAuthor(value.author ?? value.Author ?? value.user ?? value.User, value),
    createdAt: getString(value, "createdAt", "created_at", "CreatedAt"),
  };
}

export function normalizePostList(data: unknown): ApiPost[] {
  return unwrapList(data, ["posts", "items", "data"]).map(normalizePost);
}

export async function listPosts(
  page = 1,
  limit = POST_PAGE_SIZE,
): Promise<ApiPost[]> {
  const { data } = await apiHttp.get<unknown>("/posts", {
    params: { page, limit },
  });
  return normalizePostList(data);
}

export async function listMyPosts(
  page = 1,
  limit = POST_PAGE_SIZE,
): Promise<ApiPost[]> {
  const { data } = await apiHttp.get<unknown>("/posts/mine", {
    params: { page, limit },
  });
  return normalizePostList(data);
}

export async function getMyProfileSummary(): Promise<ApiProfileSummary> {
  const { data } = await apiHttp.get<unknown>("/posts/mine/summary");
  if (!isRecord(data)) {
    throw new Error("The server returned an invalid profile summary.");
  }
  return {
    postCount: getNumber(data, "post_count", "postCount", "PostCount"),
    likeCount: getNumber(data, "like_count", "likeCount", "LikeCount"),
    commentCount: getNumber(data, "comment_count", "commentCount", "CommentCount"),
  };
}

export async function createPost(input: PostInput): Promise<void> {
  await apiHttp.post("/posts", {
    title: input.title,
    content: input.body,
  });
}

export async function updatePost(id: string, input: PostInput): Promise<void> {
  await apiHttp.put(`/posts/${encodeURIComponent(id)}`, {
    title: input.title,
    content: input.body,
  });
}

export async function deletePost(id: string): Promise<void> {
  await apiHttp.delete(`/posts/${encodeURIComponent(id)}`);
}

export async function listComments(postId: string): Promise<ApiComment[]> {
  const { data } = await apiHttp.get<unknown>(
    `/posts/${encodeURIComponent(postId)}/comments`,
  );
  return unwrapList(data, ["comments", "items", "data"]).flatMap(
    normalizeCommentTree,
  );
}

function normalizeCommentTree(value: unknown): ApiComment[] {
  const comment = normalizeComment(value);
  if (!isRecord(value)) return [comment];
  const replies = value.replies ?? value.Replies;
  return [
    comment,
    ...(Array.isArray(replies) ? replies.flatMap(normalizeCommentTree) : []),
  ];
}

export async function createComment(
  postId: string,
  body: string,
  parentId: string | null = null,
): Promise<void> {
  await apiHttp.post(`/posts/${encodeURIComponent(postId)}/comments`, {
    content: body,
    parent_id: parentId === null ? null : Number(parentId),
  });
}

export async function updateComment(id: string, body: string): Promise<void> {
  await apiHttp.put(`/comments/${encodeURIComponent(id)}`, { content: body });
}

export async function deleteComment(id: string): Promise<void> {
  await apiHttp.delete(`/comments/${encodeURIComponent(id)}`);
}

export async function likePost(id: string): Promise<void> {
  await apiHttp.post(`/posts/${encodeURIComponent(id)}/likes`);
}

export async function unlikePost(id: string): Promise<void> {
  await apiHttp.delete(`/posts/${encodeURIComponent(id)}/likes`);
}

export function getPostsErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data: unknown = error.response?.data;
    if (typeof data === "string" && data.trim()) return data.trim();
    if (isRecord(data)) {
      const message = getString(data, "error", "message");
      if (message) return message;
    }
    if (!error.response) {
      return "Unable to reach the server. Check your connection and try again.";
    }
    if (error.response.status === 401) return "Please log in to view and manage posts.";
    if (error.response.status === 403) return "You don't have permission to do that.";
    return error.response.status >= 500
      ? "The server is temporarily unavailable. Please try again later."
      : "Unable to complete your request. Please try again.";
  }
  return error instanceof Error
    ? error.message
    : "Unable to complete your request. Please try again.";
}
