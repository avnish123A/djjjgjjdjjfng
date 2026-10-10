import { describe, it, expect } from 'vitest';
import { validContactEmail, validContactPhone } from '@/lib/contact';

describe('contact validation', () => {
  it('rejects concatenated emails', () => {
    expect(validContactEmail('hello@cartzebra.com/support.care@flash.co')).toBeNull();
  });
  it('accepts a single email', () => {
    expect(validContactEmail(' hello@cartzebra.com ')).toBe('hello@cartzebra.com');
  });
  it('rejects concatenated phones', () => {
    expect(validContactPhone('+91 6367920881/6376009854')).toBeNull();
  });
  it('accepts a single Indian phone', () => {
    expect(validContactPhone('+91 63679 20881')).toBe('+91 63679 20881');
  });
  it('rejects empty values', () => {
    expect(validContactEmail('')).toBeNull();
    expect(validContactPhone(undefined)).toBeNull();
  });
});
