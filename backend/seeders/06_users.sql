-- Seed data for users.
USE yek;

INSERT INTO users (role_id, full_name, email, phone, password_hash, status) VALUES
((SELECT id FROM roles WHERE name = 'super_admin'), 'Admin User', 'admin@youngescortskenya.co.ke', '+254700000001', '$2y$10$replace_with_real_hash_for_admin', 'active'),
((SELECT id FROM roles WHERE name = 'support_agent'), 'Maya D.', 'maya.support@youngescortskenya.co.ke', '+254700000002', '$2y$10$replace_with_real_hash_for_support', 'active'),
((SELECT id FROM roles WHERE name = 'profile_owner'), 'Sweet Rose', 'sweetrose@example.com', '+254712345678', '$2y$10$replace_with_real_hash_for_profile_owner', 'pending'),
((SELECT id FROM roles WHERE name = 'profile_owner'), 'Zuri Love', 'zuri@example.com', '+254722345678', '$2y$10$replace_with_real_hash_for_profile_owner', 'active'),
((SELECT id FROM roles WHERE name = 'client'), 'Demo Client', 'client@example.com', '+254733345678', '$2y$10$replace_with_real_hash_for_client', 'active');
