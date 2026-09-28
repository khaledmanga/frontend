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
