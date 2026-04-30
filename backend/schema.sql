CREATE DATABASE IF NOT EXISTS ilias_pohl CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ilias_pohl;

CREATE TABLE IF NOT EXISTS users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  username     VARCHAR(100) NOT NULL UNIQUE,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_active  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS page_visits (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  session_id  VARCHAR(100) NOT NULL,
  page        VARCHAR(255) NOT NULL,
  duration_s  DECIMAL(10, 2),
  visited_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

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
  FOREIGN KEY (user_id) REFERENCES users(id)
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
  FOREIGN KEY (user_id) REFERENCES users(id)
);
