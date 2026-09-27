# PROMPT: YC-style Community App (React 19 + React Compiler + Rust toolchain)

> Ghi chú: React Compiler là Babel plugin (JavaScript). Phần "Rust" trong prompt này
> đến từ **SWC** (Vite plugin), **Rolldown-Vite** (bundler Rust) và **Biome** (linter/formatter Rust).
> Đính kèm ảnh navbar tham chiếu cùng prompt này khi gửi cho AI.

---

# ROLE
You are a senior frontend engineer. Build a production-quality, minimal-boilerplate
social/community web app in the visual style of ycombinator.com / Hacker News.

# TECH STACK (must use)
- React 19 + TypeScript (strict)
- Build: Vite (rolldown-vite) + @vitejs/plugin-react-swc -> Rust-based compile/bundle
- React Compiler (babel-plugin-react-compiler) enabled -> do NOT write manual
  useMemo / useCallback / React.memo unless truly needed
- Lint/format: Biome (Rust). No ESLint/Prettier.
- Styling: Tailwind CSS v4 + **shadcn/ui Base UI edition** (registry "base", NOT Radix)
  + class-variance-authority + clsx + tailwind-merge
- Routing: TanStack Router (file-based, type-safe) with route guards (beforeLoad)
- Server state: TanStack Query v5 (optimistic updates, cache invalidation)
- Client state: Zustand (auth session only, persist middleware)
- Forms: react-hook-form + zod + @hookform/resolvers (one zod schema per form, infer types)
- HTTP: ky (single configured instance with auth header + 401 refresh interceptor)
- Mock backend: MSW + @mswjs/data (in-memory DB with users, posts, comments) so the
  app runs with zero backend. Keep API contracts in one `api/` folder so it can be
  swapped for a real backend.
- UI helpers: lucide-react, sonner (toasts), input-otp (verify code),
  date-fns (relative time), react-error-boundary, nuqs (URL search params),
  @tanstack/react-table (Data Table), embla-carousel-react (Carousel), recharts (Chart)
- Testing: Vitest + Testing Library + MSW (tests for auth forms and comment tree)

# DESIGN SYSTEM (match the reference: YC-style navbar)
- Background: warm cream #F4F4EE; text: near-black #1A1A1A; muted: #6B6B63;
  border: #E3E3DA; accent: YC orange #FF6600
- Font: clean geometric sans (e.g. "Inter" or "DM Sans") for UI; italic serif
  (e.g. "Instrument Serif") only for the primary CTA label
- Navbar (height 68px, sticky, cream bg, bottom hairline border), 3 zones:
  * Center: [About ▾] [Companies ▾] [Library] [ORANGE SQUARE LOGO with white "Y"]
    [Partners] [Resources ▾] [Startup Jobs] (dropdowns via Navigation Menu,
    small chevron icons, 14px, generous horizontal spacing ~48px)
  * Right: "Log in" text link + black pill CTA button ("Apply"-style, rounded-full,
    white italic serif label). After login, replace both with an avatar dropdown
    (Profile, Settings, Log out).
  * Mobile: collapse into a Sheet (hamburger) menu.
- Buttons: primary = black pill; secondary = outlined; danger = red. Inputs: 44px
  height, rounded-lg, cream-white bg, orange focus ring.
- Light mode only (dark mode optional via CSS variables).
- Fully responsive, accessible (labels, aria, focus states, keyboard nav).

---

# CORE UI COMPONENT LIBRARY (bắt buộc tạo đủ, làm TRƯỚC các trang)

## Stack cho UI
- shadcn/ui phiên bản **Base UI** (registry "base"), KHÔNG dùng Radix.
  Cài từng component bằng CLI: `pnpm dlx shadcn@latest add <name>`
- Nếu component nào không có trong registry hoặc CLI báo lỗi: tự viết tại
  `src/components/ui/<name>.tsx`, cùng quy ước với các component còn lại
  (Base UI primitive + cva + cn + data-slot + ref prop + đầy đủ a11y),
  và ghi chú lại trong README mục "Custom components".
  (Các component có thể chưa có sẵn: Attachment, Bubble, Marker, Message,
  Message Scroller, Questionnaire.)
- Toast = wrapper của Sonner, export `toast` + `<Toaster/>`.

## Danh sách component phải có trong src/components/ui/ (1 file / component)
**Layout & structure:** Accordion, Aspect Ratio, Card, Collapsible, Resizable,
Scroll Area, Separator, Sheet, Sidebar, Tabs, Item, Direction

**Form & input:** Button, Button Group, Checkbox, Combobox, Field, Input, Input Group,
Input OTP, Label, Native Select, Radio Group, Select, Slider, Switch, Textarea,
Toggle, Toggle Group, Calendar, Date Picker

**Feedback & status:** Alert, Alert Dialog, Badge, Empty, Progress, Skeleton,
Spinner, Toast, Tooltip

**Overlay & menu:** Command, Context Menu, Dialog, Drawer, Dropdown Menu,
Hover Card, Menubar, Navigation Menu, Popover

**Navigation & data:** Breadcrumb, Pagination, Table, Data Table (TanStack Table +
Table component, có sort/filter/pagination/column visibility), Carousel, Chart
(recharts wrapper: ChartContainer, ChartTooltip, ChartLegend)

**Content & chat-like:** Avatar, Attachment, Bubble, Message, Message Scroller,
Marker, Kbd, Questionnaire, Typography (h1-h4, p, lead, muted, blockquote, code, list)

## Quy ước chung cho MỌI component
- Export named, kèm `data-slot="..."` trên từng phần tử con để style theo slot.
- Variants bằng cva; props extends đúng element gốc; dùng `cn()` để merge className.
- Hỗ trợ ref, disabled, aria-*, keyboard nav, focus-visible ring màu cam #FF6600.
- Token màu lấy từ CSS variables (cream #F4F4EE, border #E3E3DA, accent #FF6600),
  KHÔNG hard-code màu trong component.
- Button: variants default (black pill) / secondary (outline) / ghost / link /
  destructive / cta (black pill + italic serif), sizes sm/md/lg/icon.
- Không viết logic nghiệp vụ trong components/ui; chỉ UI thuần.
- Có `src/components/ui/index.ts` barrel export.
- Field = wrapper chuẩn cho RHF (Label + control + description + error message),
  dùng lại cho mọi form thay vì tự viết lại.

## Trang /design-system (chỉ hiện ở dev)
- Render TẤT CẢ component ở trên, mỗi component có các state chính
  (default, hover, disabled, error, loading, sizes, variants).
- Sidebar bên trái liệt kê component, có search bằng Command (Cmd+K).
- Dùng để tự kiểm tra visual regression và làm tài liệu sống.

## Component nào dùng ở đâu trong app
- **Navbar:** Navigation Menu, Button, Avatar, Dropdown Menu, Sheet (mobile), Tooltip
- **Auth:** Card, Field, Input, Input Group (icon + show/hide password), Input OTP,
  Checkbox, Button, Spinner, Alert, Progress (password strength)
- **Home:** Tabs / Toggle Group (sort), Input Group (search), Badge (tags), Card,
  Skeleton, Empty, Dialog (create post), infinite scroll + Spinner
- **Post/Comment:** Dropdown Menu, Alert Dialog (xóa), Textarea, Collapsible (thread),
  Separator, Hover Card (xem nhanh user), Message/Bubble/Marker (nếu hợp),
  Message Scroller, Attachment (đính kèm ảnh), Tooltip, Toast
- **Profile:** Avatar, Tabs, Badge, Hover Card, Breadcrumb, Data Table (tab Posts/Upvoted dạng bảng tùy chọn)
- **Settings:** Sidebar hoặc Tabs (sub-nav), Switch, Select, Field, Alert Dialog,
  Accordion (danh sách sessions), Questionnaire (onboarding hỏi sở thích khi signup)
- Calendar/Date Picker cho ngày sinh ở profile; Chart cho thống kê hoạt động
  (posts/comments theo tuần); Carousel cho ảnh đính kèm trong post;
  Resizable/Scroll Area cho layout 2 cột trên desktop.

---

# PAGES & FEATURES

## Auth (centered card layout on cream background, shared <AuthLayout/>)
1. /login: email + password, show/hide password, "Forgot password?" link, link to sign up.
2. /signup: name, username, email, password + confirm password, password strength
   hint, terms checkbox. On success -> /verify-code.
3. /forgot-password: email -> sends code -> /verify-code?purpose=reset ->
   /reset-password (new password + confirm).
4. /verify-code: 6-digit OTP input, auto-submit on complete, 30s resend countdown,
   error state. Mock code is "123456".
- Auth flow: access token in Zustand (persisted), guard private routes,
  redirect back to the originally requested page after login.

## Home (/)
- Feed of posts (infinite scroll with useInfiniteQuery), sort tabs
  (Latest / Top / Following) synced to URL via nuqs, search box.
- "Create post" button opens a dialog (title, body markdown/textarea, tags).
- Post card: title, excerpt, author avatar+name, relative time, upvote count
  (optimistic upvote), comment count, tags, kebab menu (Edit/Delete for owner only).
- Skeleton loaders, empty state, error boundary with retry.

## Post CRUD
- Create / Read (/posts/$postId) / Update (edit dialog, prefilled) / Delete
  (confirm AlertDialog). Optimistic updates + rollback on error, toast feedback.
- Only the owner can edit/delete (enforced in UI and mock API).

## Comments + nested comments (post detail page)
- CRUD comments: add, edit inline, delete (soft delete shows "[deleted]" if it has replies).
- Nested replies to unlimited depth: store flat with `parentId`, build the tree with a
  pure util, render with a recursive <CommentNode/>.
  * Indent line/thread rail per level, visually cap indentation after depth 5
    ("Continue thread ->").
  * Collapse/expand a thread, "Reply" opens inline form, sort by newest/top.
  * Optimistic insert of new comments/replies.

## Profile (/u/$username)
- Header: avatar, name, @username, bio, joined date, follower/following counts.
- Tabs: Posts | Comments | Upvoted (each paginated).
- Owner sees "Edit profile" button (name, bio, avatar upload preview, links).

## Settings (/settings) with left sub-nav (Account, Security, Notifications, Danger zone)
- Account: change name, username, email.
- Security: change password (current/new/confirm), active sessions list (mock).
- Notifications: toggle switches (email on reply, on upvote, newsletter).
- Danger zone: delete account (type username to confirm).

---

# ARCHITECTURE (feature-based, minimal boilerplate)

```text
src/
  app/            router, providers (QueryClient, Toaster), root layout
  api/            ky client, MSW handlers, db seed
  components/ui/  core UI library (60+ components, see above) + index.ts
  components/     Navbar, AuthLayout, UserAvatar, ConfirmDialog, EmptyState
  features/
    auth/         schemas.ts, api.ts, hooks.ts (useLogin, useSignup...), store.ts, forms/
    posts/        schemas.ts, api.ts, hooks.ts (usePosts, useCreatePost...), components/
    comments/     schemas.ts, api.ts, hooks.ts, buildTree.ts, components/
    profile/  settings/
  routes/         TanStack Router file-based routes (+ /design-system in dev)
  lib/            utils.ts (cn), format.ts, query-keys.ts
```

Rules:
- Generic reusable pieces: <Field/> wrapper around RHF + shadcn, <ConfirmDialog/>,
  a `createResourceHooks()` or query-key factory to avoid repeated CRUD hooks.
- Zod schema = single source of truth for types, validation, and API payloads.
- No prop drilling: use Query hooks + Zustand selectors directly in components.
- No `any`, no unused code, files < 200 lines, absolute imports via "@/".
- Scripts: dev, build, preview, lint (biome check), test, typecheck.

---

# BUILD ORDER
1. Scaffold: Vite (rolldown) + SWC + React Compiler + Tailwind v4 + tokens +
   cva/clsx/tailwind-merge + Base UI + Biome.
2. Create ALL components in `components/ui` by group (layout -> form -> feedback ->
   overlay -> navigation/data -> content). After each group run typecheck + biome.
3. Build the /design-system page and verify every component/state.
4. Navbar + AuthLayout.
5. Auth (login, signup, forgot, verify code, reset).
6. Posts (feed + CRUD).
7. Comments (nested tree).
8. Profile + Settings.
9. Tests (auth forms, comment tree), README, final polish.

Show the code for each step.

# DELIVERABLES
1. Full working project with all files and package.json (exact deps).
2. Vite config showing rolldown-vite + SWC + React Compiler setup.
3. Seed data (10 users, 30 posts, nested comments up to depth 6).
4. README: install/run, folder structure, "Custom components" list, how to swap MSW for a real API.
5. Brief note of design decisions and how each requirement was met.

# ACCEPTANCE CHECKLIST
- [ ] Navbar visually matches the reference (orange Y logo centered, cream bg, pill CTA)
- [ ] 60+ components in `components/ui`, none over 200 lines
- [ ] /design-system shows all variants/states of every component
- [ ] No direct imports from @radix-ui/* anywhere
- [ ] No hard-coded colors outside the tokens file
- [ ] All 4 auth screens work end-to-end with validation + error states
- [ ] Post CRUD + comment CRUD + infinite nesting work with optimistic updates
- [ ] Profile and Settings pages functional and guarded
- [ ] `pnpm build` and `pnpm typecheck` pass with zero errors; Biome clean
- [ ] Lighthouse a11y >= 95