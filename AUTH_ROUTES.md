# Authentication Routes & Navigation Map

Visual guide to all authentication routes and user flows in Twelve Ninja.

## 🗺️ Route Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         PUBLIC ROUTES                           │
└─────────────────────────────────────────────────────────────────┘

/                          Landing Page (UC-001)
├─ "Begin Your Journey" ──→ /signup
└─ "Sign In" ────────────→ /login

/signup                    Sign Up Page (UC-002, UC-003)
├─ Submit form ──────────→ Success screen
│                          └→ Auto-redirect (3s) → /login
│                          └→ Email sent with verification link
├─ "Already operative?" ─→ /login
└─ "Back to Home" ───────→ /

/login                     Login Page (UC-005, UC-006)
├─ Submit form ──────────→ /game (if successful)
├─ "Forgot password?" ───→ /reset-password
├─ "Create account" ─────→ /signup
└─ "Back to Home" ───────→ /

/reset-password           Request Reset Page (UC-007)
├─ Submit form ──────────→ Success screen
│                          └→ Email sent with reset link
├─ "Remember password?" ─→ /login
└─ "Back to Login" ──────→ /login

/update-password          Update Password Page (UC-008)
├─ Submit form ──────────→ Success screen
│                          └→ Auto-redirect (2s) → /login
└─ [Accessed via email link only]

/verify-email             Email Verification (UC-004)
├─ Success ──────────────→ Auto-redirect (2s) → /game
├─ Failure ──────────────→ Error screen with "Go to Login" button
└─ [Accessed via email link only]


┌─────────────────────────────────────────────────────────────────┐
│                       PROTECTED ROUTES                          │
└─────────────────────────────────────────────────────────────────┘

/game                     Game Container (Requires Auth)
├─ If unauthenticated ───→ /login
└─ If authenticated ─────→ WorldSelection → GameViewport


┌─────────────────────────────────────────────────────────────────┐
│                         CATCH-ALL                               │
└─────────────────────────────────────────────────────────────────┘

/*                        Any unknown route
└─ Redirect ─────────────→ /
```

---

## 🔄 User Flow Diagrams

### New User Journey

```
1. Guest Visit
   ↓
   / (Landing)
   ↓
   [Click "Begin Your Journey"]
   ↓
2. Sign Up
   ↓
   /signup
   ↓
   [Fill form: username, email, password]
   ↓
   [Submit]
   ↓
3. Success Screen
   ↓
   Email sent → Inbox → Click verification link
   ↓
4. Email Verification
   ↓
   /verify-email?token_hash=...
   ↓
   [Auto-verify]
   ↓
5. Enter Game
   ↓
   /game (World Selection)
```

### Returning User Journey

```
1. Guest Visit
   ↓
   / (Landing)
   ↓
   [Click "Sign In"]
   ↓
2. Login
   ↓
   /login
   ↓
   [Fill form: email, password]
   ↓
   [Submit]
   ↓
3. Enter Game
   ↓
   /game (World Selection)
```

### Forgot Password Journey

```
1. At Login
   ↓
   /login
   ↓
   [Click "Forgot your password?"]
   ↓
2. Request Reset
   ↓
   /reset-password
   ↓
   [Enter email]
   ↓
   [Submit]
   ↓
3. Success Screen
   ↓
   Email sent → Inbox → Click reset link
   ↓
4. Update Password
   ↓
   /update-password
   ↓
   [Enter new password]
   ↓
   [Submit]
   ↓
5. Success Screen
   ↓
   Auto-redirect → /login
   ↓
6. Login with new password
```

---

## 🎯 Component Responsibilities

### Page Components

| Component | Path | Responsibility | Protected |
|-----------|------|----------------|-----------|
| `LandingPage` | `/` | Marketing page with game overview | ❌ Public |
| `SignUpPage` | `/signup` | User registration form | ❌ Public |
| `LoginPage` | `/login` | User login form | ❌ Public |
| `RequestResetPage` | `/reset-password` | Request password reset | ❌ Public |
| `UpdatePasswordPage` | `/update-password` | Set new password | ❌ Public |
| `VerifyEmailPage` | `/verify-email` | Handle email verification | ❌ Public |
| `GameApp` | `/game` | Game container (world selection + gameplay) | ✅ Protected |

### Utility Components

| Component | Purpose |
|-----------|---------|
| `AuthProvider` | Global auth state management via context |
| `ProtectedRoute` | Route guard that requires authentication |
| `BackgroundLayout` | Consistent Ink Wash background wrapper |
| `Button` | Styled button with variants (primary, ghost, danger) |

---

## 🔐 Authentication State

### Auth Context Provides:
```typescript
{
  user: User | null,           // Current authenticated user
  session: Session | null,     // Current session
  loading: boolean,            // Auth state loading
  signOut: () => Promise<void> // Sign out function
}
```

### Usage Example:
```typescript
import { useAuth } from '../lib/auth';

function MyComponent() {
  const { user, loading, signOut } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <LoginPrompt />;

  return <UserDashboard user={user} onSignOut={signOut} />;
}
```

---

## 📱 Responsive Behavior

All auth pages are responsive and work on:
- ✅ Desktop (1920px+)
- ✅ Laptop (1024px - 1920px)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 768px)

Design adjustments:
- Forms: max-width 28rem (448px)
- Feature grid: stacks vertically on mobile
- Buttons: full-width on mobile
- Diamond background: scales seamlessly (SVG)

---

## 🎨 Visual Consistency

All pages share:
- **Background**: Diamond tile pattern with ink wash atmosphere
- **Typography**:
  - Headings: Cinzel (serif)
  - Body: Inter (sans-serif)
  - Technical: Monospace
- **Colors**:
  - Background: ink-950 (#050505)
  - Cards: ink-800/50 with backdrop blur
  - Text: parchment-100 (#e8e6df)
  - Accent: hanko-500 (#cd3838)
- **Borders**: ink-700 (#1e1e1e)
- **Shadows**: Black with 40% opacity

---

## ⚡ Auto-Redirect Behavior

| Page | Trigger | Destination | Delay |
|------|---------|-------------|-------|
| `/signup` | Successful signup | `/login` | 3 seconds |
| `/verify-email` | Email verified | `/game` | 2 seconds |
| `/update-password` | Password updated | `/login` | 2 seconds |
| `/login` | Already logged in | `/game` | Immediate |
| `/game` | Not authenticated | `/login` | Immediate |

All auto-redirects show:
- ✅ Success message
- ✅ Spinning loader
- ✅ Countdown (implicit via loading animation)

---

## 🚦 Navigation Guards

### Public Pages (No Guard)
- `/` - Landing
- `/login` - Login
- `/signup` - Sign Up
- `/reset-password` - Request Reset
- `/update-password` - Update Password
- `/verify-email` - Verify Email

**Behavior**: Accessible to anyone, authenticated users may be redirected

### Protected Pages (ProtectedRoute Guard)
- `/game` - Game interface

**Behavior**:
- If authenticated → Allow access
- If not authenticated → Redirect to `/login`
- If loading → Show loading spinner

---

## 🔗 Link Relationships

### Landing Page (`/`)
- Links to: `/signup`, `/login`

### Sign Up Page (`/signup`)
- Links to: `/`, `/login`

### Login Page (`/login`)
- Links to: `/`, `/signup`, `/reset-password`

### Request Reset Page (`/reset-password`)
- Links to: `/login`

### Update Password Page (`/update-password`)
- Links to: None (accessed via email only)

### Verify Email Page (`/verify-email`)
- Links to: `/login` (on error only)

### Game Page (`/game`)
- Links to: None (game navigation is internal)
- Future: Will have logout → `/`

---

## 📧 Email Link Targets

### Verification Email
```
Link format: http://localhost:5173/verify-email?token_hash=...&type=email
Expiry: 24 hours
After success: Redirects to /game
```

### Password Reset Email
```
Link format: http://localhost:5173/update-password?token_hash=...&type=recovery
Expiry: 1 hour
After success: Redirects to /login
```

**Important**: These URLs must be configured in Supabase redirect URLs!

---

## 🎯 Future Enhancements

### Planned Routes
- `/profile` - User profile management
- `/settings` - Account settings
- `/verify-phone` - Phone number verification (if adding SMS)
- `/oauth/callback` - OAuth callback (for social login)

### Planned Features
- Sign out button in game header
- "Remember me" checkbox on login
- "Resend verification email" button
- Password strength meter on signup
- Social login (Google, Discord)

---

**Route Map Status**: ✅ Complete and navigable

**All 8 use cases**: ✅ Fully implemented and connected
