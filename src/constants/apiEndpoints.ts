export const API_ENDPOINTS = {
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  AUTH_ME: "/auth/me",
  AUTH_LOGOUT: "/auth/logout",
  POSTS: "/posts",
  MY_POSTS: "/posts/mine",
  MY_PROFILE_SUMMARY: "/posts/mine/summary",
  POST_DETAIL: (id: string) => `/posts/${encodeURIComponent(id)}`,
  POST_COMMENTS: (postId: string) =>
    `/posts/${encodeURIComponent(postId)}/comments`,
  COMMENT_DETAIL: (id: string) => `/comments/${encodeURIComponent(id)}`,
  POST_LIKES: (id: string) => `/posts/${encodeURIComponent(id)}/likes`,
} as const;

export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];
