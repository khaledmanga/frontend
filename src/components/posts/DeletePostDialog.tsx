import { Trash2 } from "lucide-react";
import type { ApiPost } from "@/api/postsApi";

type DeletePostDialogProps = {
  post: ApiPost;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeletePostDialog({
  post,
  deleting,
  onCancel,
  onConfirm,
}: DeletePostDialogProps) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onCancel}>
      <section
        className="delete-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-post-title"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="delete-modal-icon">
          <Trash2 size={20} />
        </span>
        <h2 id="delete-post-title">Delete this post?</h2>
        <p>This will permanently remove your post and can&apos;t be undone.</p>
        <div className="delete-modal-preview">
          <span>
            {post.title ? `${post.title}: ` : ""}
            {post.body}
          </span>
        </div>
        <div className="delete-modal-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="delete-confirm-button"
            disabled={deleting}
            onClick={onConfirm}
          >
            {deleting ? "Deleting..." : "Delete post"}
          </button>
        </div>
      </section>
    </div>
  );
}
