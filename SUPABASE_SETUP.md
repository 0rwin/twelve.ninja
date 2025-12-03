# Supabase Configuration Guide for Authentication

Quick setup guide for configuring Supabase to work with the Twelve Ninja authentication system.

## 🚀 Quick Start

### Step 1: Environment Variables
Create `.env.local` in project root (if not already exists):

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from:
- Supabase Dashboard → Project Settings → API

### Step 2: Configure Redirect URLs

**Supabase Dashboard → Authentication → URL Configuration**

```
Site URL:
  http://localhost:5173

Redirect URLs (add each line):
  http://localhost:5173/**
  http://localhost:5173/verify-email
  http://localhost:5173/update-password
```

For production, add:
```
  https://your-domain.com/**
  https://your-domain.com/verify-email
  https://your-domain.com/update-password
```

### Step 3: Enable Email Authentication

**Supabase Dashboard → Authentication → Providers**

- ✅ Enable "Email" provider
- ✅ Enable "Confirm email" (recommended)
- ✅ Set minimum password length: 6

### Step 4: Customize Email Templates (Optional but Recommended)

**Supabase Dashboard → Authentication → Email Templates**

#### Confirm Signup Template
```
Subject: Verify your Twelve Ninja account

Welcome to the shadows, {{ .Email }}!

Click the link below to verify your email and begin your journey:

{{ .ConfirmationURL }}

This link expires in 24 hours.

---
Twelve Ninja | 十二忍者
```

#### Reset Password Template
```
Subject: Reset your Twelve Ninja password

A password reset was requested for your account.

Click the link below to set a new password:

{{ .ConfirmationURL }}

This link expires in 1 hour. If you didn't request this, you can safely ignore this email.

---
Twelve Ninja | 十二忍者
```

### Step 5: Verify Database Functions

Run this query in **Supabase SQL Editor** to verify the `create_player_profile` function exists:

```sql
SELECT proname
FROM pg_proc
WHERE proname = 'create_player_profile';
```

If it doesn't exist, it should be created by your migrations. Check:
```bash
npx supabase db reset
```

### Step 6: Test Email Delivery

**Development (Default)**
- Supabase uses built-in email service
- Limited to ~3 emails per hour per recipient
- Check spam folder if not received

**Production (Recommended)**

Configure custom SMTP:
**Supabase Dashboard → Project Settings → Auth → SMTP Settings**

Popular options:
- **SendGrid**: Free tier (100 emails/day)
- **Resend**: Free tier (3,000 emails/month)
- **AWS SES**: Very cheap ($0.10 per 1,000 emails)
- **Mailgun**: Free tier (5,000 emails/month)

---

## 🔍 Verification Checklist

After configuration, verify:

- [ ] `.env.local` file exists with correct values
- [ ] `npm run dev` starts without errors
- [ ] Can navigate to `http://localhost:5173`
- [ ] Landing page loads with Ink Wash styling
- [ ] Signup form accessible at `/signup`
- [ ] Login form accessible at `/login`
- [ ] Redirect URLs configured in Supabase
- [ ] Email provider enabled
- [ ] Database migrations applied (`npx supabase db reset`)

---

## 🧪 Test Sign Up Flow

1. Navigate to `http://localhost:5173`
2. Click "Begin Your Journey"
3. Fill out signup form:
   - Username: `testuser`
   - Email: `your-real-email@example.com`
   - Password: `password123`
4. Submit form
5. Check email inbox (including spam)
6. Click verification link
7. Should redirect to game

---

## 🐛 Common Issues

### Issue: "Invalid redirect URL"
**Solution**: Add `http://localhost:5173/**` to Supabase redirect URLs

### Issue: "Email not received"
**Solution**:
- Check spam folder
- Wait 5 minutes (SMTP can be slow)
- Check Supabase logs: Dashboard → Logs
- Verify email template is configured

### Issue: "create_player_profile function not found"
**Solution**:
```bash
npx supabase db reset
npx supabase db push  # If using remote database
```

### Issue: "User already exists"
**Solution**:
- Go to Supabase Dashboard → Authentication → Users
- Delete the test user
- Try signup again

---

## 📊 Monitoring

### View Authentication Logs
**Supabase Dashboard → Authentication → Logs**

Shows:
- Sign up attempts
- Login attempts
- Password reset requests
- Email verification clicks

### View Database Logs
**Supabase Dashboard → Database → Logs**

Shows:
- RPC function calls
- Database errors
- Query performance

### View Users
**Supabase Dashboard → Authentication → Users**

See all registered users, their:
- Email
- Last sign in
- Confirmation status
- Metadata (username)

---

## 🔐 Security Best Practices

1. **Never commit `.env.local`** to git (already in `.gitignore`)
2. **Use strong passwords** for admin accounts
3. **Enable MFA** on Supabase dashboard account
4. **Rotate anon key** if accidentally exposed
5. **Use custom SMTP** for production (not Supabase default)
6. **Monitor auth logs** for suspicious activity
7. **Set up rate limiting** for auth endpoints
8. **Enable CAPTCHA** for production signup (Supabase supports it)

---

## 🚀 Production Deployment

Before deploying to production:

1. **Update environment variables** in hosting platform
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables

2. **Add production redirect URLs** to Supabase

3. **Configure custom SMTP** (required for production scale)

4. **Enable RLS** (already done via migrations)

5. **Set up monitoring** (Sentry, LogRocket, etc.)

6. **Configure CORS** if needed

7. **Test all 8 auth flows** in production environment

8. **Set up backups** for auth database

---

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs/guides/auth
- **Discord**: https://discord.supabase.com
- **GitHub Issues**: https://github.com/supabase/supabase/issues
- **Status Page**: https://status.supabase.com

---

**Configuration Status**: Ready for local development ✅

**Next Step**: Run `npm run dev` and test signup flow!
