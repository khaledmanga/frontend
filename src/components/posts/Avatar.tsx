type AvatarProps = { name: string };

export function Avatar({ name }: AvatarProps) {
  return (
    <img className="avatar" src="/default-avatar.jpg" alt={name || "User"} />
  );
}
