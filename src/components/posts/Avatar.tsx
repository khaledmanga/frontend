import { ASSET_URLS } from "@/constants/assets";
import { MESSAGES } from "@/constants/messages";

type AvatarProps = { name: string };

export function Avatar({ name }: AvatarProps) {
  return (
    <img
      className="avatar"
      src={ASSET_URLS.DefaultAvatar}
      alt={name || MESSAGES.user}
    />
  );
}
