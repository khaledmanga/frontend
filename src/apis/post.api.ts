import axios from "axios";
import type {
  ApiComment,
  ApiPost,
  ApiProfileSummary,
  PostAuthor,
  PostInput,
} from "@/@types/post";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import {
  API_FIELDS,
  API_NESTED_RESPONSE_CONTAINERS,
} from "@/constants/apiFields";
import { HttpStatus } from "@/constants/httpStatus";
import { MESSAGES } from "@/constants/messages";
import { POST_PAGE_SIZE } from "@/constants/pagination";
import { apiHttp } from "./http";
import { isNonEmptyString, isNumber, isRecord, isString } from "./utils";

function getString(
  record: Record<string, unknown>,
  ...keys: string[]
): string | null {
  for (const key of keys) {
    const value = record[key];
    if (isNonEmptyString(value)) return value;
    if (isNumber(value)) return String(value);
  }
  return null;
}

function getNumber(
  record: Record<string, unknown>,
  ...keys: string[]
): number {
  for (const key of keys) {
    const value = record[key];
    if (isNumber(value) && Number.isFinite(value)) return value;
    if (isNonEmptyString(value) && Number.isFinite(Number(value))) {
      return Number(value);
    }
  }
  return 0;
}

function getAuthor(value: unknown, record: Record<string, unknown>): PostAuthor {
  const author = isRecord(value) ? value : {};
  const id =
    getString(
      author,
      API_FIELDS.Id,
      API_FIELDS.UppercaseId,
      API_FIELDS.UserId,
      API_FIELDS.SnakeCaseUserId,
      API_FIELDS.UppercaseUserId,
    ) ??
    getString(
      record,
      API_FIELDS.AuthorId,
      API_FIELDS.SnakeCaseAuthorId,
      API_FIELDS.UserId,
      API_FIELDS.SnakeCaseUserId,
      API_FIELDS.UppercaseUserId,
    );
  const name =
    getString(
      author,
      API_FIELDS.Name,
      API_FIELDS.UppercaseName,
      API_FIELDS.Username,
      API_FIELDS.UppercaseUsername,
      API_FIELDS.Email,
      API_FIELDS.UppercaseEmail,
    ) ??
    getString(
      record,
      API_FIELDS.AuthorName,
      API_FIELDS.SnakeCaseAuthorName,
      API_FIELDS.UppercaseAuthorName,
      API_FIELDS.Username,
    ) ??
    MESSAGES.unknownUser;
  return { id, name };
}

function unwrapList(data: unknown, keys: string[], depth = 0): unknown[] {
  if (Array.isArray(data)) return data;
  if (!isRecord(data) || depth > 2) {
    throw new Error(MESSAGES.invalidListResponse);
  }
  for (const key of keys) {
    const value = Object.entries(data).find(
      ([field]) => field.toLowerCase() === key.toLowerCase(),
    )?.[1];
    if (Array.isArray(value)) return value;
  }
  const nested = Object.entries(data).find(([field]) =>
    API_NESTED_RESPONSE_CONTAINERS.some((key) => field.toLowerCase() === key),
  )?.[1];
  if (nested !== undefined) return unwrapList(nested, keys, depth + 1);
  throw new Error(MESSAGES.invalidListResponse);
}

export function normalizePost(value: unknown): ApiPost {
  if (!isRecord(value)) {
    throw new Error(MESSAGES.invalidPostResponse);
  }
  const id = getString(
    value,
    API_FIELDS.Id,
    API_FIELDS.UppercaseId,
    API_FIELDS.PostId,
    API_FIELDS.SnakeCasePostId,
    API_FIELDS.UppercasePostId,
  );
  const body = getString(
    value,
    API_FIELDS.Body,
    API_FIELDS.UppercaseBody,
    API_FIELDS.Content,
    API_FIELDS.UppercaseContent,
    API_FIELDS.Caption,
    API_FIELDS.Text,
  );
  if (!id || body === null) {
    throw new Error(MESSAGES.invalidPostFields);
  }
  const rawTags = value[API_FIELDS.Tags] ?? value[API_FIELDS.UppercaseTags];
  return {
    id,
    title: getString(value, API_FIELDS.Title, API_FIELDS.UppercaseTitle) ?? "",
    body,
    tags: Array.isArray(rawTags) ? rawTags.filter(isString) : [],
    author: getAuthor(
      value[API_FIELDS.Author] ??
        value[API_FIELDS.UppercaseAuthor] ??
        value[API_FIELDS.User] ??
        value[API_FIELDS.UppercaseUser],
      value,
    ),
    createdAt: getString(
      value,
      API_FIELDS.CreatedAt,
      API_FIELDS.SnakeCaseCreatedAt,
      API_FIELDS.UppercaseCreatedAt,
    ),
    votes: getNumber(
      value,
      API_FIELDS.Votes,
      API_FIELDS.UppercaseVotes,
      API_FIELDS.Likes,
      API_FIELDS.UppercaseLikes,
      API_FIELDS.LikeCount,
      API_FIELDS.SnakeCaseLikeCount,
      API_FIELDS.LikesCount,
      API_FIELDS.UppercaseLikeCount,
    ),
    voted:
      value[API_FIELDS.Voted] === true ||
      value[API_FIELDS.UppercaseVoted] === true ||
      value[API_FIELDS.Liked] === true ||
      value[API_FIELDS.IsLiked] === true ||
      value[API_FIELDS.SnakeCaseIsLiked] === true ||
      value[API_FIELDS.UppercaseIsLiked] === true ||
      value[API_FIELDS.IsVoted] === true,
    commentCount: getNumber(
      value,
      API_FIELDS.CommentCount,
      API_FIELDS.SnakeCaseCommentCount,
      API_FIELDS.UppercaseCommentCount,
      API_FIELDS.CommentsCount,
      API_FIELDS.LowercaseCommentsCount,
      API_FIELDS.SnakeCaseCommentsCount,
    ),
  };
}

export function normalizeComment(value: unknown): ApiComment {
  if (!isRecord(value)) {
    throw new Error(MESSAGES.invalidCommentResponse);
  }
  const id = getString(
    value,
    API_FIELDS.Id,
    API_FIELDS.UppercaseId,
    API_FIELDS.CommentId,
    API_FIELDS.SnakeCaseCommentId,
    API_FIELDS.UppercaseCommentId,
  );
  const body = getString(
    value,
    API_FIELDS.Body,
    API_FIELDS.UppercaseBody,
    API_FIELDS.Content,
    API_FIELDS.UppercaseContent,
    API_FIELDS.Text,
  );
  if (!id || body === null) {
    throw new Error(MESSAGES.invalidCommentFields);
  }
  return {
    id,
    parentId: getString(
      value,
      API_FIELDS.ParentId,
      API_FIELDS.SnakeCaseParentId,
      API_FIELDS.UppercaseParentId,
    ),
    body,
    author: getAuthor(
      value[API_FIELDS.Author] ??
        value[API_FIELDS.UppercaseAuthor] ??
        value[API_FIELDS.User] ??
        value[API_FIELDS.UppercaseUser],
      value,
    ),
    createdAt: getString(
      value,
      API_FIELDS.CreatedAt,
      API_FIELDS.SnakeCaseCreatedAt,
      API_FIELDS.UppercaseCreatedAt,
    ),
  };
}

export function normalizePostList(data: unknown): ApiPost[] {
  return unwrapList(data, [
    API_FIELDS.Posts,
    API_FIELDS.Items,
    API_FIELDS.Data,
  ]).map(normalizePost);
}

export async function listPosts(
  page = 1,
  limit = POST_PAGE_SIZE,
): Promise<ApiPost[]> {
  const { data } = await apiHttp.get<unknown>(API_ENDPOINTS.POSTS, {
    params: {
      [API_FIELDS.Page]: page,
      [API_FIELDS.Limit]: limit,
    },
  });
  return normalizePostList(data);
}

export async function listMyPosts(
  page = 1,
  limit = POST_PAGE_SIZE,
): Promise<ApiPost[]> {
  const { data } = await apiHttp.get<unknown>(API_ENDPOINTS.MY_POSTS, {
    params: {
      [API_FIELDS.Page]: page,
      [API_FIELDS.Limit]: limit,
    },
  });
  return normalizePostList(data);
}

export async function getMyProfileSummary(): Promise<ApiProfileSummary> {
  const { data } = await apiHttp.get<unknown>(API_ENDPOINTS.MY_PROFILE_SUMMARY);
  if (!isRecord(data)) {
    throw new Error(MESSAGES.invalidProfileSummary);
  }
  return {
    postCount: getNumber(
      data,
      API_FIELDS.PostCount,
      API_FIELDS.CamelCasePostCount,
      API_FIELDS.UppercasePostCount,
    ),
    likeCount: getNumber(
      data,
      API_FIELDS.SnakeCaseProfileLikeCount,
      API_FIELDS.CamelCaseProfileLikeCount,
      API_FIELDS.ProfileLikeCount,
    ),
    commentCount: getNumber(
      data,
      API_FIELDS.SnakeCaseProfileCommentCount,
      API_FIELDS.CamelCaseProfileCommentCount,
      API_FIELDS.ProfileCommentCount,
    ),
  };
}

export async function createPost(input: PostInput): Promise<void> {
  await apiHttp.post(API_ENDPOINTS.POSTS, {
    [API_FIELDS.Title]: input.title,
    [API_FIELDS.Content]: input.body,
  });
}

export async function updatePost(id: string, input: PostInput): Promise<void> {
  await apiHttp.put(API_ENDPOINTS.POST_DETAIL(id), {
    [API_FIELDS.Title]: input.title,
    [API_FIELDS.Content]: input.body,
  });
}

export async function deletePost(id: string): Promise<void> {
  await apiHttp.delete(API_ENDPOINTS.POST_DETAIL(id));
}

function normalizeCommentTree(value: unknown): ApiComment[] {
  const comment = normalizeComment(value);
  if (!isRecord(value)) return [comment];
  const replies =
    value[API_FIELDS.Replies] ?? value[API_FIELDS.UppercaseReplies];
  return [
    comment,
    ...(Array.isArray(replies) ? replies.flatMap(normalizeCommentTree) : []),
  ];
}

export async function listComments(postId: string): Promise<ApiComment[]> {
  const { data } = await apiHttp.get<unknown>(
    API_ENDPOINTS.POST_COMMENTS(postId),
  );
  return unwrapList(data, [
    API_FIELDS.Comments,
    API_FIELDS.Items,
    API_FIELDS.Data,
  ]).flatMap(normalizeCommentTree);
}

export async function createComment(
  postId: string,
  body: string,
  parentId: string | null = null,
): Promise<void> {
  await apiHttp.post(API_ENDPOINTS.POST_COMMENTS(postId), {
    [API_FIELDS.Content]: body,
    [API_FIELDS.SnakeCaseParentId]: parentId === null ? null : Number(parentId),
  });
}

export async function updateComment(id: string, body: string): Promise<void> {
  await apiHttp.put(API_ENDPOINTS.COMMENT_DETAIL(id), {
    [API_FIELDS.Content]: body,
  });
}

export async function deleteComment(id: string): Promise<void> {
  await apiHttp.delete(API_ENDPOINTS.COMMENT_DETAIL(id));
}

export async function likePost(id: string): Promise<void> {
  await apiHttp.post(API_ENDPOINTS.POST_LIKES(id));
}

export async function unlikePost(id: string): Promise<void> {
  await apiHttp.delete(API_ENDPOINTS.POST_LIKES(id));
}

export function getPostsErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data: unknown = error.response?.data;
    if (isNonEmptyString(data)) return data.trim();
    if (isRecord(data)) {
      const message = getString(data, API_FIELDS.Error, API_FIELDS.Message);
      if (message) return message;
    }
    if (!error.response) {
      return MESSAGES.cannotReachServer;
    }
    if (error.response.status === HttpStatus.Unauthorized) {
      return MESSAGES.loginRequiredForPosts;
    }
    if (error.response.status === HttpStatus.Forbidden) {
      return MESSAGES.permissionDenied;
    }
    return error.response.status >= HttpStatus.InternalServerError
      ? MESSAGES.serverUnavailable
      : MESSAGES.requestFailed;
  }
  return error instanceof Error ? error.message : MESSAGES.requestFailed;
}