-- Seed data for roles.
USE yek;

INSERT INTO roles (name, description) VALUES
('client', 'Client account for browsing and saving profiles'),
('profile_owner', 'Account that owns and manages a public profile'),
('support_agent', 'Staff account for messages and support tickets'),
('admin', 'Administrator account'),
('super_admin', 'Full system administrator');

