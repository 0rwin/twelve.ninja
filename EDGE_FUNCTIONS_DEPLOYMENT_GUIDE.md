# Edge Functions Deployment Guide

This guide explains how to deploy the server-side Edge Functions for profile management.

## Prerequisites

1. **Supabase CLI installed** ✅ (You already have this from SESSION_NOTES.md)
2. **Supabase project linked** ✅ (Already done: `amekgfcnljqpkrhviprf`)
3. **Local Supabase running** (or deploying directly to remote)

---

## Quick Deploy (Production)

### Option 1: Deploy All Functions at Once

```bash
# From project root
npx supabase functions deploy update-username
npx supabase functions deploy change-password
npx supabase functions deploy delete-account
```

### Option 2: Deploy and Test Locally First

```bash
# Start Supabase locally
npm run db:start

# Serve functions locally
npx supabase functions serve update-username
# In another terminal:
npx supabase functions serve change-password
# In another terminal:
npx supabase functions serve delete-account
```

---

## Step-by-Step Deployment

### 1. Verify Edge Functions Exist

Check that these files exist:
```
supabase/
└── functions/
    ├── update-username/
    │   └── index.ts
    ├── change-password/
    │   └── index.ts
    └── delete-account/
        └── index.ts
```

✅ **These files have already been created for you!**

---

### 2. Test Functions Locally (Recommended)

#### Start Supabase Locally
```bash
npm run db:start
```

#### Serve a Function Locally
```bash
# In one terminal
npx supabase functions serve update-username --env-file .env.local

# The function will be available at:
# http://localhost:54321/functions/v1/update-username
```

#### Test with curl

```bash
# First, get your auth token by logging in through your app
# Then test the function:

curl -i --location --request POST 'http://localhost:54321/functions/v1/update-username' \
  --header 'Authorization: Bearer YOUR_JWT_TOKEN_HERE' \
  --header 'Content-Type: application/json' \
  --data '{"newUsername":"TestNinja123"}'
```

Expected response:
```json
{"ok":true}
```

---

### 3. Deploy to Production

#### Deploy Single Function
```bash
npx supabase functions deploy update-username
```

#### Deploy All Functions
```bash
npx supabase functions deploy update-username && \
npx supabase functions deploy change-password && \
npx supabase functions deploy delete-account
```

You should see output like:
```
Deploying update-username (project ref: amekgfcnljqpkrhviprf)
Bundled update-username in 245ms
Deployed update-username to production in 2.3s
  https://amekgfcnljqpkrhviprf.supabase.co/functions/v1/update-username
```

---

### 4. Verify Deployment

#### Check Function Status
```bash
npx supabase functions list
```

Expected output:
```
┌─────────────────┬─────────────┬──────────────┐
│ Name            │ Version     │ Status       │
├─────────────────┼─────────────┼──────────────┤
│ update-username │ latest      │ Active       │
│ change-password │ latest      │ Active       │
│ delete-account  │ latest      │ Active       │
└─────────────────┴─────────────┴──────────────┘
```

#### Test in Production (After Deploy)

Use your app's UI:
1. Go to `/profile`
2. Click "Edit" next to username
3. Change username
4. Should see success message!

Or test with curl:
```bash
curl -i --location --request POST 'https://amekgfcnljqpkrhviprf.supabase.co/functions/v1/update-username' \
  --header 'Authorization: Bearer YOUR_PRODUCTION_JWT' \
  --header 'Content-Type: application/json' \
  --data '{"newUsername":"ProductionNinja"}'
```

---

## Environment Variables

The Edge Functions automatically have access to these environment variables:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (has admin permissions)
- `SUPABASE_ANON_KEY` - Public anon key

These are **automatically injected** by Supabase when you deploy. No action needed!

If you need custom environment variables:
```bash
# Set secrets (encrypted)
npx supabase secrets set MY_SECRET=value

# List secrets
npx supabase secrets list
```

---

## Troubleshooting

### Error: "Function not found"

**Problem**: Function URL returns 404

**Solution**:
```bash
# Re-deploy the function
npx supabase functions deploy update-username

# Check deployment status
npx supabase functions list
```

---

### Error: "Unauthorized"

**Problem**: Getting 401 errors when calling function

**Solution**: Verify your JWT token is valid:
```bash
# In your app, check the token:
const session = await supabase.auth.getSession()
console.log(session.data.session?.access_token)
```

The token should be passed in the `Authorization` header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### Error: "Username already taken" (when it shouldn't be)

**Problem**: Database query isn't working correctly

**Solution**: Check the database directly:
```sql
-- In Supabase Studio SQL Editor:
SELECT id, username FROM players WHERE username = 'TestNinja';
```

---

### Error: Function logs show errors

**Problem**: Function is failing internally

**Solution**: View function logs:
```bash
# View logs for a specific function
npx supabase functions logs update-username

# Follow logs in real-time
npx supabase functions logs update-username --follow
```

---

## Testing Checklist

After deployment, test each function:

### ✅ Update Username
- [ ] Navigate to `/profile`
- [ ] Click edit button next to username
- [ ] Change username to something new
- [ ] Click checkmark to save
- [ ] See success message
- [ ] Refresh page - new username should persist
- [ ] Check `event_log` table in Supabase Studio:
  ```sql
  SELECT * FROM event_log WHERE event_type = 'username_changed' ORDER BY created_at DESC LIMIT 5;
  ```

### ✅ Change Password
- [ ] Click "Change Password" section
- [ ] Enter new password (min 6 chars)
- [ ] Confirm password
- [ ] Click "Change Password"
- [ ] See success message
- [ ] Log out
- [ ] Log back in with new password - should work!
- [ ] Check `event_log` table:
  ```sql
  SELECT * FROM event_log WHERE event_type = 'password_changed' ORDER BY created_at DESC LIMIT 5;
  ```

### ✅ Delete Account
- [ ] Click "Delete Account" danger section
- [ ] Read warnings
- [ ] Type "DELETE" in confirmation field
- [ ] Click "Confirm Delete Account"
- [ ] Should see success and redirect
- [ ] Try to log back in - should fail (account deleted)
- [ ] Check `event_log` table:
  ```sql
  SELECT * FROM event_log WHERE event_type = 'account_deleted' ORDER BY created_at DESC LIMIT 5;
  ```

---

## Monitoring & Logs

### View Recent Function Invocations

In Supabase Dashboard:
1. Go to **Edge Functions** section
2. Click on a function name
3. View **Logs** tab
4. See real-time invocations and errors

### View Event Log

In Supabase Studio SQL Editor:
```sql
-- All profile-related events
SELECT
  created_at,
  event_type,
  payload
FROM event_log
WHERE event_type IN ('username_changed', 'password_changed', 'account_deleted')
ORDER BY created_at DESC
LIMIT 20;
```

---

## Rollback (If Needed)

If you deploy a broken function:

### Option 1: Re-deploy Previous Version
```bash
# If you have the working code in git history:
git checkout <previous-commit>
npx supabase functions deploy update-username
git checkout main
```

### Option 2: Quick Fix
```bash
# Edit the file locally
# Then re-deploy:
npx supabase functions deploy update-username
```

Functions are deployed instantly - changes take effect immediately.

---

## Security Notes

1. **Service Role Key** is automatically available in Edge Functions
   - Never expose this key to the client!
   - It's automatically injected by Supabase
   - Has full admin permissions

2. **JWT Verification** happens in each function
   - `supabase.auth.getUser(token)` validates the JWT
   - Only authenticated users can call these functions

3. **Input Validation** happens server-side
   - Client validation is UX only
   - Server validation is the source of truth

4. **Event Logging** creates audit trail
   - All changes are logged to `event_log`
   - Immutable append-only log
   - Can replay/audit any profile change

---

## Next Steps

After deploying these functions, you can:

1. **Test the profile page** in your app at `/profile`
2. **Monitor the event_log** to see audit trail
3. **Add rate limiting** if you see abuse (Supabase dashboard)
4. **Add stronger password requirements** (edit `change-password/index.ts`)
5. **Add email notifications** when password changes

---

## Quick Reference

```bash
# Deploy all functions
npx supabase functions deploy update-username && \
npx supabase functions deploy change-password && \
npx supabase functions deploy delete-account

# Check status
npx supabase functions list

# View logs
npx supabase functions logs update-username --follow

# Test locally
npx supabase functions serve update-username
```

---

## Support

If you encounter issues:

1. Check function logs: `npx supabase functions logs <function-name>`
2. Verify deployment: `npx supabase functions list`
3. Test locally first: `npx supabase functions serve <function-name>`
4. Check Supabase Dashboard for errors
5. Review event_log table for audit trail

---

**Deployment Status**: Ready to deploy! ✅

All Edge Functions are created and client code is updated. Just run the deploy commands above and test!
