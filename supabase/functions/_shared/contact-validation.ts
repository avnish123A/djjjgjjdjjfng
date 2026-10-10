/**
 * Pure contact-detail validation shared by the storefront and server emails.
 * A value is only shown publicly when it is exactly ONE well-formed entry;
 * concatenated values (e.g. "a@x.com/b@y.com") are rejected, never guessed at.
 */
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

export function validContactEmail(value: string | null | undefined): string | null {
  const v = (value ?? '').trim();
  return v && EMAIL_RE.test(v) ? v : null;
}

/** Accepts one Indian number: optional +91/91/0 prefix, 10 digits starting 6–9, spaces/hyphens allowed. */
export function validContactPhone(value: string | null | undefined): string | null {
  const v = (value ?? '').trim();
  if (!v || !/^[+\d\s-]+$/.test(v)) return null;
  const digits = v.replace(/\D/g, '');
  const local = digits.length === 12 && digits.startsWith('91') ? digits.slice(2)
    : digits.length === 11 && digits.startsWith('0') ? digits.slice(1)
    : digits;
  return /^[6-9]\d{9}$/.test(local) ? v : null;
}

/** Digits-only tel: href for a validated phone. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, '')}`;
}
