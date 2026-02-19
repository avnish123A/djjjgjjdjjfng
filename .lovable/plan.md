

# High-Tech Admin Login Panel Upgrade

## Overview
Redesign the admin login page into a premium, high-tech experience with smooth animations, enhanced features, and a polished UI that matches the AUREA luxury brand.

## What You'll Get

### 1. Stunning Visual Redesign
- Dark gradient background with animated floating particles/grid pattern
- Frosted glass (glassmorphism) login card with subtle glow effects
- Animated AUREA logo with gold shimmer effect
- Smooth fade-in and slide-up entrance animations using Framer Motion

### 2. Enhanced Login Features
- **Show/Hide Password Toggle** -- eye icon to reveal password
- **Remember Me Checkbox** -- persist email in localStorage
- **Forgot Password Flow** -- sends a password reset email, with a dedicated reset page
- **Password Strength Indicator** -- real-time bar showing weak/medium/strong
- **Input Validation** -- inline error messages with smooth transitions
- **Loading Spinner** -- animated gold spinner during authentication

### 3. Smooth Animations
- Staggered form field entrance (each field slides in sequentially)
- Button hover glow and press effects
- Error/success message slide-in animations
- Mode switch (login/signup) crossfade transition

### 4. Password Reset Flow
- New "Forgot Password?" link on login form
- Sends reset email via the authentication system
- New `/admin/reset-password` route to handle the reset callback
- Success/error feedback with animations

---

## Technical Details

### Files to Create
1. **`src/pages/admin/AdminResetPassword.tsx`** -- handles the password reset callback, lets user set a new password

### Files to Modify
1. **`src/pages/admin/AdminLogin.tsx`** -- complete redesign with:
   - Framer Motion animations (already installed)
   - Glassmorphism card styling
   - Animated background with CSS gradients and floating orbs
   - Show/hide password toggle
   - Remember me checkbox
   - Forgot password link
   - Password strength meter (for signup mode)
   - Staggered field animations

2. **`src/App.tsx`** -- add `/admin/reset-password` route

3. **`src/index.css`** -- add keyframes for floating orb animation and glassmorphism utilities

### Libraries Used (already installed)
- `framer-motion` for entrance/exit animations
- `lucide-react` for icons (Eye, EyeOff, Check, Shield)
- `@radix-ui/react-checkbox` for Remember Me

### Authentication Flow
- Login: existing `supabase.auth.signInWithPassword` + admin role check
- Signup: existing `supabase.auth.signUp` with email verification
- Forgot Password: `supabase.auth.resetPasswordForEmail` with redirect to `/admin/reset-password`
- Reset Password: `supabase.auth.updateUser({ password })` on the reset page

