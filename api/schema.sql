CREATE DATABASE IF NOT EXISTS interapt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE interapt;

-- One row per learning module (e.g. 'pohl', 'other-module').
-- The backend's MODULE_NAME env var selects which row is active.
CREATE TABLE IF NOT EXISTS modules (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users are unique per module — same username is allowed in different modules.
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  module_id   INT NOT NULL,
  username    VARCHAR(100) NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_per_module (module_id, username),
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS page_visits (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  session_id  VARCHAR(100) NOT NULL,
  page        VARCHAR(255) NOT NULL,
  duration_s  DECIMAL(10, 2),
  visited_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- module_id here is the learning section ID (e.g. 'intro-experiment'),
-- not the global module. The global module context is implicit via user_id → users.module_id.
CREATE TABLE IF NOT EXISTS module_results (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  user_id          INT NOT NULL,
  session_id       VARCHAR(100) NOT NULL,
  module_id        VARCHAR(100) NOT NULL,
  question_id      VARCHAR(100) NOT NULL,
  is_correct       BOOLEAN,
  selected_answers JSON,
  correct_answers  JSON,
  attempt_count    INT DEFAULT 1,
  answered_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS test_results (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT NOT NULL,
  session_id     VARCHAR(100) NOT NULL,
  test_id        VARCHAR(100) NOT NULL,
  question_id    VARCHAR(100) NOT NULL,
  is_correct     BOOLEAN,
  user_answer    JSON,
  correct_answer JSON,
  points_awarded INT,
  max_points     INT,
  answered_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
