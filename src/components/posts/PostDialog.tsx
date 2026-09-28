import { X } from "lucide-react";
import { type FormEvent, useState } from "react";
import type { ApiPost } from "@/@types/post";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { MESSAGES } from "@/constants/messages";
import { BUTTON_VARIANTS } from "@/constants/ui";
import { VALIDATION_LIMITS } from "@/constants/validation";

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
          <Button variant={BUTTON_VARIANTS.Unstyled} type="button" onClick={onClose} aria-label={MESSAGES.close}>
            <X size={20} />
          </Button>
          <h2 id="post-dialog-title">{post ? MESSAGES.editPost : MESSAGES.newPost}</h2>
          <Button
            variant={BUTTON_VARIANTS.Unstyled}
            type="submit"
            className="text-action"
            disabled={!title.trim() || !body.trim() || saving}
          >
            {saving
              ? MESSAGES.saving
              : post
                ? MESSAGES.save
                : MESSAGES.publish}
          </Button>
        </header>
        <Input
          unstyled
          className="post-title-input"
          value={title}
          maxLength={VALIDATION_LIMITS.PostTitleMaxLength}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={MESSAGES.postTitle}
          aria-label={MESSAGES.postTitleLabel}
          required
        />
        <Textarea
          unstyled
          autoFocus
          value={body}
          maxLength={VALIDATION_LIMITS.PostBodyMaxLength}
          onChange={(event) => setBody(event.target.value)}
          placeholder={MESSAGES.postBodyPlaceholder}
          aria-label={MESSAGES.postBodyLabel}
          required
        />
      </form>
    </div>
  );
}
