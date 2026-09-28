import { Trash2 } from "lucide-react";
import type { ApiPost } from "@/@types/post";
import { Button } from "@/components/ui/Button";
import { MESSAGES } from "@/constants/messages";
import { BUTTON_VARIANTS } from "@/constants/ui";

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
        <h2 id="delete-post-title">{MESSAGES.deletePostConfirmTitle}</h2>
        <p>{MESSAGES.deletePostConfirmDescription}</p>
        <div className="delete-modal-preview">
          <span>
            {post.title ? `${post.title}: ` : ""}
            {post.body}
          </span>
        </div>
        <div className="delete-modal-actions">
          <Button variant={BUTTON_VARIANTS.Unstyled} type="button" className="secondary-button" onClick={onCancel}>
            {MESSAGES.cancel}
          </Button>
          <Button
            variant={BUTTON_VARIANTS.Unstyled}
            type="button"
            className="delete-confirm-button"
            disabled={deleting}
            onClick={onConfirm}
          >
            {deleting ? MESSAGES.deletingPost : MESSAGES.deletePost}
          </Button>
        </div>
      </section>
    </div>
  );
}
