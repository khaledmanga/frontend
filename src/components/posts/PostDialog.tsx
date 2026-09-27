import { type FormEvent, useState } from "react";
import type { ApiPost } from "@/api/postsApi";
import { X } from "lucide-react";

type PostDialogProps = {
  post?: ApiPost;
  saving: boolean;
  onClose: () => void;
  onSave: (title: string, body: string) => Promise<boolean>;
};

export function PostDialog({
  post,
  saving,
  onClose,
  onSave,
}: PostDialogProps) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [body, setBody] = useState(post?.body ?? "");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const titleValue = title.trim();
    const bodyValue = body.trim();
    if (!bodyValue) return;
    if (await onSave(titleValue, bodyValue)) onClose();
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <form
        className="create-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-dialog-title"
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => void submit(event)}
      >
        <header>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
          <h2 id="post-dialog-title">{post ? "Edit post" : "New post"}</h2>
          <button
            type="submit"
            className="text-action"
            disabled={!title.trim() || !body.trim() || saving}
          >
            {saving ? "Saving..." : post ? "Save" : "Publish"}
          </button>
        </header>
        <input
          className="post-title-input"
          value={title}
          maxLength={200}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title"
          aria-label="Post title"
          required
        />
        <textarea
          autoFocus
          value={body}
          maxLength={10000}
          onChange={(event) => setBody(event.target.value)}
          placeholder="What would you like to share?"
          aria-label="Post body"
          required
        />
      </form>
    </div>
  );
}
