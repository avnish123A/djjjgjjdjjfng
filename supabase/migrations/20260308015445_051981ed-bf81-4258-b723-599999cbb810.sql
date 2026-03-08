UPDATE payment_settings 
SET key_id = 'rzp_test_SN4XZBRoW202r5', 
    key_secret = 'cp4e6VJkZDmlpiepz8SV42SX', 
    is_enabled = true, 
    environment = 'test',
    updated_at = now()
WHERE gateway_name = 'razorpay';