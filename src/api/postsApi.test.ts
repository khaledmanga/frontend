import { describe, expect, it } from "vitest";
import {
  normalizeComment,
  normalizePost,
  normalizePostList,
} from "./postsApi";
import { apiHttp } from "./http";

describe("API client", () => {
  it("sends browser session cookies with all API requests", () => {
    expect(apiHttp.defaults.withCredentials).toBe(true);
  });
});

describe("normalizePost", () => {
  it("normalizes a post with nested author data", () => {
    expect(
      normalizePost({
        id: 12,
        title: "A title",
        body: "Post content",
        tags: ["engineering"],
        author: { id: 7, name: "Alex" },
        created_at: "2026-09-26T10:00:00Z",
        votes: 4,
        voted: true,
        comment_count: 2,
      }),
    ).toEqual({
      id: "12",
      title: "A title",
      body: "Post content",
      tags: ["engineering"],
      author: { id: "7", name: "Alex" },
      createdAt: "2026-09-26T10:00:00Z",
      votes: 4,
      voted: true,
      commentCount: 2,
    });
  });

  it("normalizes default Go field names and an enveloped list item", () => {
    expect(
      normalizePostList({
        data: {
          posts: [
            {
              ID: 1,
              Title: "Go post",
              Content: "Server response",
              Author: { ID: 2, Name: "Sam" },
            },
          ],
        },
      }),
    ).toEqual([
      {
        id: "1",
        title: "Go post",
        body: "Server response",
        tags: [],
        author: { id: "2", name: "Sam" },
        createdAt: null,
        votes: 0,
        voted: false,
        commentCount: 0,
      },
    ]);
  });

  it("rejects malformed post responses instead of fabricating content", () => {
    expect(() => normalizePost({ id: 1 })).toThrow(
      "The server returned a post without an ID or body.",
    );
  });

  it("uses the author fields returned by the API DTO", () => {
    expect(
      normalizePost({
        id: 12,
        content: "Server content",
        author_id: 7,
        author_name: "Alex",
      }).author,
    ).toEqual({ id: "7", name: "Alex" });
  });
});

describe("normalizeComment", () => {
  it("normalizes comment fields and author", () => {
    expect(
      normalizeComment({
        comment_id: "c1",
        parent_id: null,
        content: "Useful comment",
        user: { id: "u1", username: "alex" },
      }),
    ).toEqual({
      id: "c1",
      parentId: null,
      body: "Useful comment",
      author: { id: "u1", name: "alex" },
      createdAt: null,
    });
  });

  it("normalizes the API's flat author fields", () => {
    expect(
      normalizeComment({
        id: 12,
        content: "Server comment",
        author_id: 7,
        author_name: "Alex",
      }).author,
    ).toEqual({ id: "7", name: "Alex" });
  });
});
