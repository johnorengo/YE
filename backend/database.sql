-- YEK backend database schema.
-- Designed for MySQL / MariaDB.

CREATE DATABASE IF NOT EXISTS yek;
USE yek;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS saved_replies;
DROP TABLE IF EXISTS admin_notes;
DROP TABLE IF EXISTS support_tickets;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS ad_boosts;
DROP TABLE IF EXISTS ads;
DROP TABLE IF EXISTS profile_verifications;
DROP TABLE IF EXISTS profile_photos;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS subscription_plans;
DROP TABLE IF EXISTS profile_categories;
DROP TABLE IF EXISTS password_resets;
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS featured_towns;
DROP TABLE IF EXISTS highways;
DROP TABLE IF EXISTS towns;
DROP TABLE IF EXISTS counties;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE counties (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code CHAR(3) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL UNIQUE,
  capital VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE towns (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  county_id INT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_towns_county
    FOREIGN KEY (county_id) REFERENCES counties(id)
    ON DELETE CASCADE,
  UNIQUE KEY uq_towns_county_name (county_id, name),
  KEY idx_towns_name (name)
);

CREATE TABLE highways (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) NOT NULL,
  name VARCHAR(180) NOT NULL,
  corridor VARCHAR(180) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_highways_name (name),
  KEY idx_highways_code (code)
);

CREATE TABLE featured_towns (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  town_name VARCHAR(100) NOT NULL,
  display_order INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_featured_towns_town_name (town_name),
  UNIQUE KEY uq_featured_towns_display_order (display_order)
);

CREATE TABLE roles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role_id INT UNSIGNED NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  phone VARCHAR(30) NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  status ENUM('active', 'pending', 'suspended', 'blocked') NOT NULL DEFAULT 'pending',
  last_login_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_role
    FOREIGN KEY (role_id) REFERENCES roles(id),
  KEY idx_users_status (status),
  KEY idx_users_email (email)
);

CREATE TABLE user_sessions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(255) NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at DATETIME NULL,
  CONSTRAINT fk_user_sessions_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  KEY idx_user_sessions_expires_at (expires_at)
);

CREATE TABLE password_resets (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_password_resets_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE profile_categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL UNIQUE,
  display_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscription_plans (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL UNIQUE,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  duration_days INT UNSIGNED NOT NULL DEFAULT 30,
  can_boost BOOLEAN NOT NULL DEFAULT FALSE,
  max_photos INT UNSIGNED NOT NULL DEFAULT 6,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profiles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  plan_id INT UNSIGNED NOT NULL,
  town_id INT UNSIGNED NULL,
  highway_id INT UNSIGNED NULL,
  alias VARCHAR(100) NOT NULL,
  handle VARCHAR(80) NOT NULL UNIQUE,
  bio TEXT NULL,
  age INT UNSIGNED NULL,
  status ENUM('active', 'pending', 'suspended', 'rejected') NOT NULL DEFAULT 'pending',
  verification_status ENUM('not_verified', 'under_review', 'verified', 'rejected') NOT NULL DEFAULT 'not_verified',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  published_at DATETIME NULL,
  suspended_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_profiles_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_profiles_category
    FOREIGN KEY (category_id) REFERENCES profile_categories(id),
  CONSTRAINT fk_profiles_plan
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id),
  CONSTRAINT fk_profiles_town
    FOREIGN KEY (town_id) REFERENCES towns(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_profiles_highway
    FOREIGN KEY (highway_id) REFERENCES highways(id)
    ON DELETE SET NULL,
  KEY idx_profiles_status (status),
  KEY idx_profiles_verification_status (verification_status),
  KEY idx_profiles_alias (alias)
);

CREATE TABLE profile_photos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  profile_id INT UNSIGNED NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(180) NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INT UNSIGNED NOT NULL DEFAULT 0,
  status ENUM('active', 'pending', 'rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_profile_photos_profile
    FOREIGN KEY (profile_id) REFERENCES profiles(id)
    ON DELETE CASCADE,
  KEY idx_profile_photos_profile_order (profile_id, display_order)
);

CREATE TABLE profile_verifications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  profile_id INT UNSIGNED NOT NULL,
  submitted_by_user_id INT UNSIGNED NOT NULL,
  reviewed_by_user_id INT UNSIGNED NULL,
  document_type VARCHAR(80) NOT NULL,
  document_url VARCHAR(500) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  review_notes TEXT NULL,
  submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at DATETIME NULL,
  CONSTRAINT fk_profile_verifications_profile
    FOREIGN KEY (profile_id) REFERENCES profiles(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_profile_verifications_submitter
    FOREIGN KEY (submitted_by_user_id) REFERENCES users(id),
  CONSTRAINT fk_profile_verifications_reviewer
    FOREIGN KEY (reviewed_by_user_id) REFERENCES users(id)
    ON DELETE SET NULL,
  KEY idx_profile_verifications_status (status)
);

CREATE TABLE ads (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  profile_id INT UNSIGNED NOT NULL,
  plan_id INT UNSIGNED NOT NULL,
  title VARCHAR(180) NOT NULL,
  body TEXT NULL,
  status ENUM('draft', 'pending', 'scheduled', 'active', 'expired', 'reported', 'rejected') NOT NULL DEFAULT 'draft',
  publish_at DATETIME NULL,
  expires_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ads_profile
    FOREIGN KEY (profile_id) REFERENCES profiles(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_ads_plan
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id),
  KEY idx_ads_status (status),
  KEY idx_ads_publish_at (publish_at),
  KEY idx_ads_expires_at (expires_at)
);

CREATE TABLE ad_boosts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ad_id BIGINT UNSIGNED NOT NULL,
  boosted_by_user_id INT UNSIGNED NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  status ENUM('scheduled', 'active', 'expired', 'cancelled') NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ad_boosts_ad
    FOREIGN KEY (ad_id) REFERENCES ads(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_ad_boosts_user
    FOREIGN KEY (boosted_by_user_id) REFERENCES users(id)
    ON DELETE SET NULL,
  KEY idx_ad_boosts_status_dates (status, starts_at, ends_at)
);

CREATE TABLE favorites (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  profile_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_favorites_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_favorites_profile
    FOREIGN KEY (profile_id) REFERENCES profiles(id)
    ON DELETE CASCADE,
  UNIQUE KEY uq_favorites_user_profile (user_id, profile_id)
);

CREATE TABLE payments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  profile_id INT UNSIGNED NULL,
  ad_id BIGINT UNSIGNED NULL,
  reference VARCHAR(100) NOT NULL UNIQUE,
  provider VARCHAR(60) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'KES',
  status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  paid_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_user
    FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_payments_profile
    FOREIGN KEY (profile_id) REFERENCES profiles(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_payments_ad
    FOREIGN KEY (ad_id) REFERENCES ads(id)
    ON DELETE SET NULL,
  KEY idx_payments_status (status)
);

CREATE TABLE reports (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reported_by_user_id INT UNSIGNED NULL,
  profile_id INT UNSIGNED NULL,
  ad_id BIGINT UNSIGNED NULL,
  reason VARCHAR(160) NOT NULL,
  details TEXT NULL,
  status ENUM('open', 'under_review', 'resolved', 'dismissed') NOT NULL DEFAULT 'open',
  reviewed_by_user_id INT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME NULL,
  CONSTRAINT fk_reports_reporter
    FOREIGN KEY (reported_by_user_id) REFERENCES users(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_reports_profile
    FOREIGN KEY (profile_id) REFERENCES profiles(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_reports_ad
    FOREIGN KEY (ad_id) REFERENCES ads(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_reports_reviewer
    FOREIGN KEY (reviewed_by_user_id) REFERENCES users(id)
    ON DELETE SET NULL,
  KEY idx_reports_status (status)
);

CREATE TABLE conversations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  subject VARCHAR(180) NULL,
  profile_id INT UNSIGNED NULL,
  client_user_id INT UNSIGNED NULL,
  assigned_admin_user_id INT UNSIGNED NULL,
  status ENUM('open', 'pending', 'resolved', 'archived', 'blocked') NOT NULL DEFAULT 'open',
  priority ENUM('low', 'normal', 'high', 'urgent') NOT NULL DEFAULT 'normal',
  last_message_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_conversations_profile
    FOREIGN KEY (profile_id) REFERENCES profiles(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_conversations_client
    FOREIGN KEY (client_user_id) REFERENCES users(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_conversations_admin
    FOREIGN KEY (assigned_admin_user_id) REFERENCES users(id)
    ON DELETE SET NULL,
  KEY idx_conversations_status (status),
  KEY idx_conversations_last_message_at (last_message_at)
);

CREATE TABLE messages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  conversation_id BIGINT UNSIGNED NOT NULL,
  sender_user_id INT UNSIGNED NULL,
  sender_type ENUM('client', 'profile_owner', 'admin', 'system') NOT NULL,
  body TEXT NOT NULL,
  read_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_messages_conversation
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_messages_sender
    FOREIGN KEY (sender_user_id) REFERENCES users(id)
    ON DELETE SET NULL,
  KEY idx_messages_conversation_created (conversation_id, created_at)
);

CREATE TABLE support_tickets (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  conversation_id BIGINT UNSIGNED NULL,
  opened_by_user_id INT UNSIGNED NULL,
  assigned_admin_user_id INT UNSIGNED NULL,
  title VARCHAR(180) NOT NULL,
  category ENUM('general', 'billing', 'verification', 'report', 'technical', 'other') NOT NULL DEFAULT 'general',
  status ENUM('open', 'in_progress', 'resolved', 'closed') NOT NULL DEFAULT 'open',
  priority ENUM('low', 'normal', 'high', 'urgent') NOT NULL DEFAULT 'normal',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolved_at DATETIME NULL,
  CONSTRAINT fk_support_tickets_conversation
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_support_tickets_opener
    FOREIGN KEY (opened_by_user_id) REFERENCES users(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_support_tickets_admin
    FOREIGN KEY (assigned_admin_user_id) REFERENCES users(id)
    ON DELETE SET NULL,
  KEY idx_support_tickets_status (status)
);

CREATE TABLE admin_notes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_user_id INT UNSIGNED NULL,
  profile_id INT UNSIGNED NULL,
  conversation_id BIGINT UNSIGNED NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_admin_notes_admin
    FOREIGN KEY (admin_user_id) REFERENCES users(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_admin_notes_profile
    FOREIGN KEY (profile_id) REFERENCES profiles(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_admin_notes_conversation
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    ON DELETE CASCADE
);

CREATE TABLE saved_replies (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE,
  body TEXT NOT NULL,
  category VARCHAR(80) NULL,
  created_by_user_id INT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_saved_replies_creator
    FOREIGN KEY (created_by_user_id) REFERENCES users(id)
    ON DELETE SET NULL
);

CREATE TABLE notifications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  title VARCHAR(140) NOT NULL,
  body VARCHAR(500) NULL,
  type VARCHAR(60) NOT NULL,
  read_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  KEY idx_notifications_user_read (user_id, read_at)
);

CREATE TABLE audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor_user_id INT UNSIGNED NULL,
  action VARCHAR(120) NOT NULL,
  entity_type VARCHAR(80) NOT NULL,
  entity_id BIGINT UNSIGNED NULL,
  metadata JSON NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_logs_actor
    FOREIGN KEY (actor_user_id) REFERENCES users(id)
    ON DELETE SET NULL,
  KEY idx_audit_logs_entity (entity_type, entity_id),
  KEY idx_audit_logs_created_at (created_at)
);

-- Seed data has been moved to backend/seeders.sql.

