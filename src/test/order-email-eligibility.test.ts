import { describe, expect, it } from 'vitest';
import { isConfirmable } from '../../supabase/functions/_shared/order-confirmation-email';

describe('Existing confirmation eligibility stays unchanged', () => {
  it('allows a successfully placed COD order without claiming prepaid payment', () => {
    expect(isConfirmable({ payment_method: 'cod', payment_status: 'pending', order_status: 'pending' })).toBe(true);
  });
  it('allows verified prepaid payment', () => {
    expect(isConfirmable({ payment_method: 'razorpay', payment_status: 'paid', order_status: 'processing' })).toBe(true);
  });
  it('rejects unpaid Razorpay confirmation', () => {
    expect(isConfirmable({ payment_method: 'razorpay', payment_status: 'pending', order_status: 'pending' })).toBe(false);
  });
  it('rejects failed Cashfree payment', () => {
    expect(isConfirmable({ payment_method: 'cashfree', payment_status: 'failed', order_status: 'pending' })).toBe(false);
  });
  it('rejects cancelled orders even when payment was made', () => {
    expect(isConfirmable({ payment_method: 'razorpay', payment_status: 'paid', order_status: 'cancelled' })).toBe(false);
  });
});