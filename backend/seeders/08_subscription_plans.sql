-- Seed data for subscription_plans.
USE yek;

INSERT INTO subscription_plans (name, price, duration_days, can_boost, max_photos) VALUES
('Free', 0.00, 30, FALSE, 3),
('Standard', 1500.00, 30, TRUE, 6),
('Premium', 3500.00, 30, TRUE, 12),
('Elite', 7500.00, 30, TRUE, 20);

