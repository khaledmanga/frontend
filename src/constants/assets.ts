export const ASSET_URLS = {
  AuthShowcase:
    "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1400&q=85",
  DefaultAvatar: "/default-avatar.jpg",
  InitialsAvatar: (seed: string) =>
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed)}`,
} as const;
