-- Migration: add ON DELETE CASCADE to all user_id foreign keys.
-- Safe to run on the live database — no data is touched.

USE ilias_pohl;

-- ── page_visits ──────────────────────────────────────────────────────────────
SET @fk = (
  SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE
  WHERE TABLE_SCHEMA = 'ilias_pohl' AND TABLE_NAME = 'page_visits'
    AND REFERENCED_TABLE_NAME = 'users' LIMIT 1
);
SET @sql = CONCAT('ALTER TABLE page_visits DROP FOREIGN KEY ', @fk);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

ALTER TABLE page_visits
  ADD CONSTRAINT fk_page_visits_user
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- ── module_results ────────────────────────────────────────────────────────────
SET @fk = (
  SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE
  WHERE TABLE_SCHEMA = 'ilias_pohl' AND TABLE_NAME = 'module_results'
    AND REFERENCED_TABLE_NAME = 'users' LIMIT 1
);
SET @sql = CONCAT('ALTER TABLE module_results DROP FOREIGN KEY ', @fk);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

ALTER TABLE module_results
  ADD CONSTRAINT fk_module_results_user
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- ── test_results ──────────────────────────────────────────────────────────────
SET @fk = (
  SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE
  WHERE TABLE_SCHEMA = 'ilias_pohl' AND TABLE_NAME = 'test_results'
    AND REFERENCED_TABLE_NAME = 'users' LIMIT 1
);
SET @sql = CONCAT('ALTER TABLE test_results DROP FOREIGN KEY ', @fk);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

ALTER TABLE test_results
  ADD CONSTRAINT fk_test_results_user
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
