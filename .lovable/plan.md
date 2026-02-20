
# Fix Maintenance / Coming Soon Mode

## Problems Found

1. **Storefront flashes before maintenance page appears** -- When site mode is loading from the database, `MaintenanceGuard` shows the full storefront instead of a blank/loading screen. Non-admin visitors briefly see the store before seeing the maintenance page.

2. **Admin Settings page shows wrong initial selection** -- The `AdminSiteSettings` component uses `useState(siteMode)` which captures the default value (`'live'`) if the real mode hasn't loaded yet. The radio selection never updates to match the actual database value.

3. **Admin users may see a maintenance flash** -- The guard doesn't wait for the admin role check to finish. While admin auth is loading, `isAdmin` is false, causing a brief maintenance page flash before the admin role resolves.

---

## Fix Plan

### 1. Fix MaintenanceGuard (src/App.tsx)

- Check BOTH `SiteModeContext.isLoading` AND `AdminAuthContext.isLoading`
- While either is loading, show a neutral loading state (blank screen or simple spinner) instead of the full storefront
- Only show maintenance page OR storefront once both have resolved

```text
Before:
  if (isAdmin) -> show store
  if (isLoading) -> show store  <-- BUG: flashes store
  if (not live) -> show maintenance

After:
  if (siteMode loading OR admin auth loading) -> show blank/spinner
  if (isAdmin) -> show store
  if (not live) -> show maintenance
  if (live) -> show store
```

### 2. Fix AdminSiteSettings selected state sync (src/pages/admin/AdminSiteSettings.tsx)

- Add a `useEffect` that syncs `selected` whenever `siteMode` changes from the context
- This ensures the radio buttons reflect the actual database value even if the component mounts before the mode loads

### 3. Fix Maintenance page animation class (src/pages/Maintenance.tsx)

- Verify the `animate-float-gentle` CSS class exists in `index.css`; if not, add it or use a standard Tailwind animation

---

## Technical Details

### File: src/App.tsx
- Update `MaintenanceGuard` to destructure `isLoading` from both `useSiteMode()` and `useAdminAuth()`
- Rename to avoid collision (e.g., `isSiteLoading` and `isAuthLoading`)
- Show a minimal full-screen loader while either is loading
- This prevents both the storefront flash for visitors AND the maintenance flash for admins

### File: src/pages/admin/AdminSiteSettings.tsx
- Add `useEffect(() => { setSelected(siteMode); }, [siteMode]);`
- This keeps the radio selection in sync with real-time updates

### File: src/index.css (if needed)
- Add `animate-float-gentle` keyframes if not already present for the Maintenance page gift icon animation
